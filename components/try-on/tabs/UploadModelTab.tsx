import TitleSectionTab from "./TitleSectionTab";
import UploadSkeleton from "./UploadSkeleton";

interface UploadModelTabProps {
  onImageSelect: (imageUrl: string) => void;
  selectedImage?: string;
}

const UploadModelTab: React.FC<UploadModelTabProps> = ({ onImageSelect, selectedImage }) => {
  return (
    <TitleSectionTab title="Resmini Yükle">
      <UploadSkeleton 
        title="Model resmini yükle" 
        onImageSelect={onImageSelect}
        selectedImage={selectedImage}
      />
    </TitleSectionTab>
  );
};

export default UploadModelTab;
