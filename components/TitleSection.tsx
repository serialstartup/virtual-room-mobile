import { type ReactNode, type FC } from 'react'
import AnimatedView from "./ui/AnimatedView";
import AnimatedText from "./ui/AnimatedText";
import { View } from 'react-native';

interface TitleSectionProps {
  children?: ReactNode
  title: string
  subtitle?: string
  bgColor?: string
  className?: string
}

const TitleSection: FC<TitleSectionProps> = ({title,subtitle,children,bgColor,className}) => {
  return (
    <AnimatedView className={`p-4 items-center  ${bgColor ? bgColor : 'bg-white'} ${className}`} animation="fadeIn" duration={600} easing="easeInOut">
    <View className='mb-6 mt-4 px-8'> 
        <AnimatedText className="text-2xl font-semibold text-center text-black">
        {title}
      </AnimatedText>
      <AnimatedText className="text-base text-center mt-1 text-virtual-text-muted">
        {subtitle}
      </AnimatedText>
    </View>
        {children}
    </AnimatedView>
  );
}

export default TitleSection