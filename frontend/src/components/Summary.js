import { Card, CardContent, Box, Typography } from '@mui/material'
import { PropTypes } from 'prop-types'
import TrendingUp from '@mui/icons-material/TrendingUp'
import TrendingDown from '@mui/icons-material/TrendingDown'
import Article from '@mui/icons-material/Article'

const Summary = ({ label, value, total, change, onClick, bgcolor, titleColor }) => {
  const precentChange = value / total * 100
  return (
    <Card
      sx={{
        height: '150px',
        cursor: onClick ? 'pointer' : 'default',
        bgcolor: bgcolor,
        boxShadow: 'none',
        marginBottom: '10px'
      }}
      onClick={onClick}
    >
      <CardContent
        sx={{
          p: 1,
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            opacity: 0.7,
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              bgcolor: 'grayF4.main',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Article size={24} />
          </Box>
          <Typography
            variant="body2"
            sx={{
              whiteSpace: 'pre-line',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              bgcolor: 'grayF4.main',
              flexShrink: 1,
              fontSize: 14,
            }}
          >
            <b>{label}</b>
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'right' }}>
          <Typography
            variant="h1"
            sx={{
              fontWeight: 700,
              marginBottom: 1,
              color: titleColor || '#0052cc',
              fontSize: 28,
            }}
          >
            {value}
          </Typography>
        </Box>
        {total && (
          <Box sx={{ textAlign: 'left', display: 'flex', alignItems: 'center', marginLeft: 2 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                marginBottom: 1,
                alignItems: 'center',
                display: 'flex',
                marginRight: 2,
                fontSize: 14,
              }}
              style={{color: change === 'up' ? '#42aa10' : '#DC2626' }}
            >
              {change === 'up' ? (
              <TrendingUp />
              ) : (
                <TrendingDown />
              )}
              {`${precentChange.toFixed(2)}%`}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                opacity: 0.7,
                marginBottom: 1,
                alignItems: 'center',
                fontSize: 14,
                display: 'flex',
              }}
            >
              {`Total: ${total}`}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
 
Summary.defaultProps = {
  lable: "",
  value: 0,
  change: "up",
}

Summary.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  change: PropTypes.string,
  value: PropTypes.number,
  total: PropTypes.number,
  onClick: PropTypes.func,
}

export default Summary
