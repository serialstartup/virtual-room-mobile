import { View, Text } from "react-native";
import React from "react";
import { GradientView, PageWrapper, SectionWrapper } from "@/components";
import TopStatistics from "@/components/wardrope/TopStatistics";
import EachOutput from "@/components/wardrope/EachOutput";
import PageHeader from "@/components/PageHeader";

const Wardrope = () => {
  return (
    <PageWrapper>
      <SectionWrapper >
        <PageHeader title="My Wardrobe" subtitle="Your saved outfits and try-ons" />
      </SectionWrapper>

      <SectionWrapper className="p-4">
        <TopStatistics />
      </SectionWrapper>

      <SectionWrapper className="flex-1 p-0">
        <EachOutput />
      </SectionWrapper>
    </PageWrapper>
  );
};

export default Wardrope;
