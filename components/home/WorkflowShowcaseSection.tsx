import { View, Text } from "react-native";
import { FlashList } from "@shopify/flash-list";
import AnimatedView from "../ui/AnimatedView";
import WorkflowCard from "./WorkflowCard";

interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  image?: any;
  text?: string;
  badge?: string;
}

interface WorkflowShowcaseSectionProps {
  // workflowType: WorkflowType;
  title: string;
  subtitle: string;
  steps: WorkflowStep[];
  accentColor: string;
  onTryNow?: () => void;
}

const WorkflowShowcaseSection: React.FC<WorkflowShowcaseSectionProps> = ({
  // workflowType,
  title,
  subtitle,
  steps,
  accentColor,
  onTryNow,
}) => {
  // const router = useRouter();
  // const { t } = useTranslation();
  // const { setActiveWorkflow } = useWorkflowStore();

  // const handleTryNow = () => {
  //   if (onTryNow) {
  //     onTryNow();
  //   } else {
  //     setActiveWorkflow(workflowType);
  //     router.push("/(tabs)/try-on");
  //   }
  // };

  const renderItem = ({
    item,
    index,
  }: {
    item: WorkflowStep;
    index: number;
  }) => (
    <WorkflowCard
      id={item.id}
      title={item.title}
      description={item.description}
      image={item.image}
      text={item.text}
      badge={item.badge}
      accentColor={accentColor}
      // onPress={handleTryNow}
      index={index}
    />
  );

  return (
    <View className="mb-10">
      {/* Section Header */}
      <AnimatedView animation="fadeIn" duration={400} className="px-6 mb-4">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-xl font-outfit-semibold text-gray-900">{title}</Text>
        </View>
        <Text className="text-sm font-outfit text-gray-600">{subtitle}</Text>
      </AnimatedView>

      {/* Horizontal Scroll List */}
      <View className="h-[300px] pl-3 ">
        <FlashList
          data={steps}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.id}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 24 }}
        />
      </View>
    </View>
  );
};

export default WorkflowShowcaseSection;
