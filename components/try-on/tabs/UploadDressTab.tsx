import React from 'react'
import TitleSectionTab from "./TitleSectionTab";
import UploadSkeleton from "./UploadSkeleton";

const UploadDressTab = () => {
  return (
    <TitleSectionTab title="Kıyafet Yükle">
      <UploadSkeleton title="Kıyafet resmini yükle" />
    </TitleSectionTab>
  )
}

export default UploadDressTab