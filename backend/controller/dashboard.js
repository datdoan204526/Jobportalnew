const mongoose = require("mongoose");
const User = require("../model/user");
const Job = require("../model/job");
const Application = require("../model/applications");

const getSummary = async (req, res) => {
  try {
    // Lấy ngày hiện tại (đặt thời gian về đầu ngày)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Lấy ngày hiện tại (đặt thời gian về cuối ngày)
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Tính tổng số lượng user theo từng loại và số lượng user được tạo trong ngày
    const summary = await User.aggregate([
      {
        $facet: {
          totalByType: [
            {
              $group: {
                _id: "$type",
                count: { $sum: 1 },
              },
            },
          ],
          createdTodayByType: [
            {
              $match: {
                createdAt: {
                  $gte: todayStart,
                  $lte: todayEnd,
                },
              },
            },
            {
              $group: {
                _id: "$type",
                count: { $sum: 1 },
              },
            },
          ],
          createdLast6Months: [
            {
              $project: {
                month: { $month: "$createdAt" },
                year: { $year: "$createdAt" },
              },
            },
            {
              $group: {
                _id: { year: "$year", month: "$month" },
                count: { $sum: 1 },
              },
            },
            {
              $sort: { "_id.year": -1, "_id.month": -1 },
            },
            {
              $limit: 6,
            },
          ],
        },
      },
    ]);

    // Lấy tổng số lượng job
    const totalJobs = await Job.countDocuments();

    // Lấy số lượng ứng dụng theo trạng thái (status)
    const applicationsByStatus = await Application.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Định dạng lại "applicationsByStatus" thành mảng
    const applicationsByStatusArray = applicationsByStatus.map(item => ({
      status: item._id,
      count: item.count,
    }));

    // Định dạng lại "createdLast6Months" thành mảng với các đối tượng { month, count }
    const createdLast6MonthsArray = summary[0].createdLast6Months.map(item => {
      const monthYear = `${item._id.month < 10 ? '0' + item._id.month : item._id.month}/${item._id.year}`;
      return {
        month: monthYear,
        count: item.count,
      };
    });

    // Định dạng dữ liệu trả về theo yêu cầu
    const summaryData = summary[0];

    const result = {
      applicant: {
        createdToday: summaryData.createdTodayByType.find(item => item._id === "applicant")?.count || 0,
        total: summaryData.totalByType.find(item => item._id === "applicant")?.count || 0,
      },
      recruiter: {
        createdToday: summaryData.createdTodayByType.find(item => item._id === "recruiter")?.count || 0,
        total: summaryData.totalByType.find(item => item._id === "recruiter")?.count || 0,
      },
      admin: {
        createdToday: summaryData.createdTodayByType.find(item => item._id === "admin")?.count || 0,
        total: summaryData.totalByType.find(item => item._id === "admin")?.count || 0,
      },
      totalJobs,  // Thêm tổng số job vào kết quả
      applicationsByStatus: applicationsByStatusArray, // Định dạng lại số lượng applications theo status
      createdLast6Months: createdLast6MonthsArray, // Định dạng lại số lượng user được tạo trong từng tháng của 6 tháng gần nhất
    };

    // Trả về response
    res.status(200).json({
      message: "Summary fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while fetching the summary",
      error: error.message,
    });
  }
};

module.exports = {
  getSummary,
};
