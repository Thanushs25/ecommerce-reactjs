import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearUserId, clearAdminId } from '../redux/credentials/idSlice';

const useLogout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const logout = (userType) => {
        localStorage.removeItem('token');
        
        if (userType === 'admin') {
            dispatch(clearAdminId());
            console.log(`${userType} logged out`);
            navigate('/');
            window.location.reload();
        } else {
            dispatch(clearUserId());
            console.log(`${userType} logged out`);
            navigate('/');
            window.location.reload();
        }
    };

    return { logout };
};

export default useLogout;