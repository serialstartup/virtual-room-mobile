import { useState, useEffect, useCallback } from "react";
import { View, Alert } from "react-native";
import { AnimatePresence, MotiView } from "moti";
import PageWrapper from "../../components/PageWrapper";
import { SectionWrapper } from "@/components";
import PageHeader from "@/components/PageHeader";
import { useAppStore } from "@/store/appStore";
import { ArrowLeft } from "lucide-react-native";
// New Multi-Modal Components
import WorkflowSelector from "@/components/try-on/WorkflowSelector";
import ClassicTryOn from "@/components/try-on/workflows/ClassicTryOn";
import ProductToModel from "@/components/try-on/workflows/ProductToModel";
import TextToFashion from "@/components/try-on/workflows/TextToFashion";
import AvatarTryOn from "@/components/try-on/workflows/AvatarTryOn";
import ResultModal from "@/components/try-on/ResultModal";
import { useTranslation } from "react-i18next";

// Stores
import { useWorkflowStore } from "@/store/workflowStore";

const TryOn = () => {
  const { t } = useTranslation();
  const { activeWorkflow, resetCurrentWorkflow } = useWorkflowStore();
  const { getLastActiveTryOn, removeActiveTryOn, addActiveTryOn } =
    useAppStore();

  const [showResultModal, setShowResultModal] = useState(false);
  const [currentTryOnId, setCurrentTryOnId] = useState<string | null>(null);
  const [showWorkflowSelection, setShowWorkflowSelection] = useState(true);

  // Load saved data on mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        // Check for active try-ons
        const activeTryOn = getLastActiveTryOn();
        if (activeTryOn) {
          Alert.alert(
            t("tryOn.continueProcessing.title"),
            t("tryOn.continueProcessing.message"),
            [
              {
                text: t("tryOn.continueProcessing.cancel"),
                onPress: () => removeActiveTryOn(activeTryOn.tryOnId),
                style: "cancel",
              },
              {
                text: t("tryOn.continueProcessing.viewResult"),
                onPress: () => {
                  setCurrentTryOnId(activeTryOn.tryOnId);
                  setShowResultModal(true);
                  setShowWorkflowSelection(false);
                },
              },
            ]
          );
        }
      } catch (error) {
        console.error("[TRY_ON] ❌ Error loading saved data:", error);
      }
    };

    loadSavedData();
  }, [getLastActiveTryOn, removeActiveTryOn]);

  const handleWorkflowSelect = () => {
    setShowWorkflowSelection(false);
  };

  const handleBackToWorkflowSelector = () => {
    setShowWorkflowSelection(true);
    resetCurrentWorkflow();
  };

  const handleTryOnCreate = async (tryOnId: string) => {
    try {
      // Save active try-on to storage
      addActiveTryOn(tryOnId);

      setCurrentTryOnId(tryOnId);
      setShowResultModal(true);
    } catch (error) {
      console.error("[TRY_ON] ❌ Error saving active try-on:", error);
      // Still show the modal even if saving fails
      setCurrentTryOnId(tryOnId);
      setShowResultModal(true);
    }
  };

  const handleAvatarCreate = async (avatarId: string) => {
    try {
      console.log(
        "[TRY_ON] 👤 Avatar created, showing progress modal:",
        avatarId
      );

      // For avatar creation, we use the avatar ID as try-on ID
      // This allows ResultModal to track the avatar processing
      setCurrentTryOnId(avatarId);
      setShowResultModal(true);
      setShowWorkflowSelection(false);
    } catch (error) {
      console.error("[TRY_ON] ❌ Error handling avatar creation:", error);
      // Still show the modal even if saving fails
      setCurrentTryOnId(avatarId);
      setShowResultModal(true);
    }
  };

  const handleResultModalClose = async () => {
    try {
      // Remove from active try-ons when closing
      if (currentTryOnId) {
        removeActiveTryOn(currentTryOnId);
      }
    } catch (error) {
      console.error("[TRY_ON] ❌ Error removing active try-on:", error);
    } finally {
      setShowResultModal(false);
      setCurrentTryOnId(null);
    }
  };

  const handleRetry = async () => {
    try {
      // Remove from active try-ons when retrying
      if (currentTryOnId) {
        removeActiveTryOn(currentTryOnId);
      }
    } catch (error) {
      console.error("[TRY_ON] ❌ Error removing active try-on:", error);
    } finally {
      setShowResultModal(false);
      setCurrentTryOnId(null);
      // Keep the form data for retry
    }
  };

  const handleFormReset = () => {
    resetCurrentWorkflow();
    setShowWorkflowSelection(true);
  };

  const renderWorkflowContent = () => {
    switch (activeWorkflow) {
      case "classic":
        return <ClassicTryOn onTryOnCreate={handleTryOnCreate} />;
      case "product-to-model":
        return <ProductToModel onTryOnCreate={handleTryOnCreate} />;
      case "text-to-fashion":
        return <TextToFashion onTryOnCreate={handleTryOnCreate} />;
      case "avatar":
        return (
          <AvatarTryOn
            onTryOnCreate={handleTryOnCreate}
            onAvatarCreate={handleAvatarCreate}
          />
        );
      default:
        return <ClassicTryOn onTryOnCreate={handleTryOnCreate} />;
    }
  };

  return (
    <PageWrapper>
      <View className="flex-1">
        {showWorkflowSelection ? (
          // Workflow Selection Screen
          <AnimatePresence>
            <MotiView
              key="workflow-selector"
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "timing", duration: 300 }}
              className="flex-1"
            >
              <SectionWrapper>
                <PageHeader
                  title={t("tryOn.pageHeaderTitle")}
                  subtitle={t("tryOn.pageHeaderSubtitle")}
                />
              </SectionWrapper>

              <WorkflowSelector onWorkflowSelect={handleWorkflowSelect} />
            </MotiView>
          </AnimatePresence>
        ) : (
          // Selected Workflow Screen
          <AnimatePresence>
            <MotiView
              key={`workflow-${activeWorkflow}`}
              from={{ opacity: 0, translateX: 50 }}
              animate={{ opacity: 1, translateX: 0 }}
              exit={{ opacity: 0, translateX: -50 }}
              transition={{ type: "timing", duration: 300 }}
              className="flex-1"
            >
              <SectionWrapper>
                {/* Back Button - Top Left */}
                <View className="px-4 ">
                  <View
                    className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center self-start"
                    onTouchEnd={handleBackToWorkflowSelector}
                  >
                    <ArrowLeft size={20} color="#374151" />
                  </View>
                </View>

                {/* Page Header - Centered */}
                <PageHeader
                  title={`${activeWorkflow.charAt(0).toUpperCase() + activeWorkflow.slice(1).replace("-", " ")} ${t("tryOn.workflow")}`}
                />
              </SectionWrapper>

              {/* Workflow Content */}
              <View className="flex-1">{renderWorkflowContent()}</View>
            </MotiView>
          </AnimatePresence>
        )}
      </View>

      <ResultModal
        visible={showResultModal}
        tryOnId={currentTryOnId}
        onClose={handleResultModalClose}
        onRetry={handleRetry}
        onClearForm={handleFormReset}
        isAvatarProcessing={activeWorkflow === "avatar"}
        isTextToFashionProcessing={activeWorkflow === "text-to-fashion"}
      />
    </PageWrapper>
  );
};

export default TryOn;
