import React from "react";
import { useTranslation } from "react-i18next";
import TitleSectionTab from "./TitleSectionTab";
import UploadSkeleton from "./UploadSkeleton";

interface UploadDressTabProps {
  onImageSelect: (imageUrl: string, description?: string) => void;
  selectedImage?: string;
}

const UploadDressTab: React.FC<UploadDressTabProps> = ({ onImageSelect, selectedImage }) => {
  const { t } = useTranslation();
  
  return (
    <TitleSectionTab title={t("uploadDressTab.title")}>
      <UploadSkeleton 
        title={t("uploadDressTab.uploadClothingImage")} 
        onImageSelect={onImageSelect}
        selectedImage={selectedImage}
      />
    </TitleSectionTab>
  )
}

export default UploadDressTab