import React from "react";
import TitleSectionTab from "./TitleSectionTab";
import UploadSkeleton from "./UploadSkeleton";

const UploadModelTab = () => {
  return (
    <TitleSectionTab title="Resmini Yükle">
      <UploadSkeleton title="Model resmini yükle" />
    </TitleSectionTab>
  );
};

export default UploadModelTab;
