import TitleSectionTab from "./TitleSectionTab";
import UploadSkeleton from "./UploadSkeleton";
import UploadWithAvatarSelection from "./UploadWithAvatarSelection";
import { UserAvatar } from '@/hooks/useUserAvatars';

interface UploadModelTabProps {
  onImageSelect: (imageUrl: string) => void;
  selectedImage?: string;
  title : string;
  skeletonTitle : string;
  enableAvatarSelection?: boolean;
  onAvatarSelect?: (avatar: UserAvatar | null) => void;
  selectedAvatar?: UserAvatar | null;
}

const UploadModelTab: React.FC<UploadModelTabProps> = ({ 
  onImageSelect, 
  selectedImage, 
  title, 
  skeletonTitle,
  enableAvatarSelection = false,
  onAvatarSelect,
  selectedAvatar
}) => {
  return (
    <TitleSectionTab title={title}>
      {enableAvatarSelection ? (
        <UploadWithAvatarSelection
          title={skeletonTitle} 
          onImageSelect={onImageSelect}
          selectedImage={selectedImage}
          enableAvatarSelection={enableAvatarSelection}
          onAvatarSelect={onAvatarSelect}
          selectedAvatar={selectedAvatar}
        />
      ) : (
        <UploadSkeleton 
          title={skeletonTitle} 
          onImageSelect={onImageSelect}
          selectedImage={selectedImage}
        />
      )}
    </TitleSectionTab>
  );
};

export default UploadModelTab;
