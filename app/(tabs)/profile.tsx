import { ScrollView } from "react-native";
import { PageWrapper, SectionWrapper } from "@/components";
import PageHeader from "@/components/PageHeader";
import ProfileSettings from "@/components/profile/ProfileSettings";
// import PremiumCard from "@/components/profile/PremiumCard";
import GeneralSettings from "@/components/profile/GeneralSettings";
import CriticialButtons from "@/components/profile/CriticialButtons";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const { t } = useTranslation();

  return (
    <PageWrapper>
      <ScrollView>
        <SectionWrapper>
          <PageHeader
            title={t("profile.pageHeaderTitle")}
            subtitle={t("profile.pageHeaderSubtitle")}
          />
        </SectionWrapper>

        <SectionWrapper className="p-4 my-4">
          <ProfileSettings />
        </SectionWrapper>

        <SectionWrapper className="p-4 my-4">
          <GeneralSettings />
        </SectionWrapper>

        {/* <SectionWrapper className="p-4 my-4">
          <PremiumCard />
        </SectionWrapper> */}

        <SectionWrapper className="my-4">
          <CriticialButtons />
        </SectionWrapper>
      </ScrollView>
    </PageWrapper>
  );
};

export default Profile;
