import { styled } from "@mui/material/styles";
import { AppBar, Toolbar, Box, IconButton, Typography, Button } from "@mui/material";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 50%, rgba(255, 255, 255, 0.95) 100%)',
  borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.1)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  '&[data-theme="dark"]': {
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.2) 50%, rgba(10, 10, 10, 0.95) 100%)',
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  justifyContent: 'space-between',
}));

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid rgba(139, 92, 246, 0.2)',
  color: '#171717',
  marginRight: theme.spacing(2),
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
  },
  transition: 'all 0.3s ease',
  '&[data-theme="dark"]': {
    color: '#ededed',
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: '#171717',
  fontSize: '1.2rem',
  letterSpacing: '0.5px',
  background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  '&[data-theme="dark"]': {
    color: '#ededed',
  },
})) as typeof Typography;

const StyledLogoutButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid rgba(239, 68, 68, 0.2)',
  color: '#dc2626',
  fontWeight: 500,
  fontSize: '0.875rem',
  padding: '8px 16px',
  borderRadius: '8px',
  textTransform: 'none',
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%)',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
  },
  transition: 'all 0.3s ease',
  '&[data-theme="dark"]': {
    color: '#fca5a5',
    border: '1px solid rgba(239, 68, 68, 0.3)',
  },
}));

export { StyledAppBar, StyledToolbar, StyledBox, StyledIconButton, StyledTypography, StyledLogoutButton };