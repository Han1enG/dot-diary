import salaryIcon from '@/assets/icons/salary.png';
import weekendIcon from '@/assets/icons/weekend.png';
import birthdayIcon from '@/assets/icons/birthday.png';
import fireworksIcon from '@/assets/icons/fireworks.png';
import heartIcon from '@/assets/icons/heart.png';

export const getRandomColor = () => {
    const colors = ['#FF9A8B', '#4CC9F0', '#F72585', '#7209B7', '#FFBE0B', '#3A86FF'];
    return colors[Math.floor(Math.random() * colors.length)];
};

export const getIconByTitle = (title: string) => {
    if (title.includes('工资')) return salaryIcon;
    if (title.includes('周末')) return weekendIcon;
    if (title.includes('生日')) return birthdayIcon;
    if (title.includes('新年')) return fireworksIcon;
    if (title.includes('一起') || title.includes('纪念')) return heartIcon;
    return heartIcon;
};

export const getDisplayTitle = (originalTitle: string, isPast: boolean) => {
    return isPast ? `${originalTitle}已经` : `距离${originalTitle}还有`;
};