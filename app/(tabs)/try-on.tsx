import React from "react";
import Hero from "@/components/try-on/Hero";
import PersonModal from "@/components/try-on/PersonModal";
import DressModal from "@/components/try-on/DressModal";
import CreateButton from "@/components/try-on/CreateButton";
import PageWrapper from "../../components/PageWrapper";
import { SectionWrapper } from "@/components";
import { ScrollView } from "react-native";
import { Footer } from "../../components/Footer";

const TryOn = () => {
  return (
    <PageWrapper withoutTopEdge>
      <ScrollView>
        <SectionWrapper>
          <Hero />
        </SectionWrapper>

        <SectionWrapper className="p-6 bg-gray-100 my-8 mx-4 rounded-2xl">
          <PersonModal />
        </SectionWrapper>

        <SectionWrapper className="p-6 bg-gray-100 my-8 mx-4 rounded-2xl">
          <DressModal />
        </SectionWrapper>

        <SectionWrapper className="p-6">
          <CreateButton />
        </SectionWrapper>
        <Footer />
      </ScrollView>
    </PageWrapper>
  );
};

export default TryOn;
