import TitleSectionTab from "./TitleSectionTab";
import UploadSkeleton from "./UploadSkeleton";

interface UploadDressTabProps {
  onImageSelect: (imageUrl: string, description?: string) => void;
  selectedImage?: string;
}

const UploadDressTab: React.FC<UploadDressTabProps> = ({ onImageSelect, selectedImage }) => {
  return (
    <TitleSectionTab title="Kıyafet Yükle">
      <UploadSkeleton 
        title="Kıyafet resmini yükle" 
        onImageSelect={onImageSelect}
        selectedImage={selectedImage}
      />
    </TitleSectionTab>
  )
}

export default UploadDressTab