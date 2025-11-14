import { useState, useEffect } from "react";
import PersonModal from "@/components/try-on/PersonModal";
import DressModal from "@/components/try-on/DressModal";
import CreateButton from "@/components/try-on/CreateButton";
import ResultModal from "@/components/try-on/ResultModal";
import PageWrapper from "../../components/PageWrapper";
import { SectionWrapper } from "@/components";
import { ScrollView, Alert } from "react-native";
import { Footer } from "../../components/Footer";
import PageHeader from "@/components/PageHeader";
import { storageService } from "@/services/storage";
import type { TryOnData } from "@/services/storage";

const TryOn = () => {
  const [tryOnData, setTryOnData] = useState<TryOnData>({
    selectedPersonImage: undefined,
    selectedDressImage: undefined,
    dressDescription: undefined,
  });
  
  const [showResultModal, setShowResultModal] = useState(false);
  const [currentTryOnId, setCurrentTryOnId] = useState<string | null>(null);

  // Load saved data on mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        
        // Load form data
        const savedData = await storageService.loadTryOnData();
        if (savedData) {
          setTryOnData(savedData);
        }
        
        // Check for active try-ons
        const activeTryOn = await storageService.getLastActiveTryOn();
        if (activeTryOn) {
          Alert.alert(
            'Devam Eden İşlem',
            'Daha önce başlatılan bir try-on işlemi var. Sonucunu görmek ister misiniz?',
            [
              {
                text: 'Hayır',
                onPress: () => storageService.removeActiveTryOn(activeTryOn.tryOnId),
                style: 'cancel'
              },
              {
                text: 'Evet',
                onPress: () => {
                  setCurrentTryOnId(activeTryOn.tryOnId);
                  setShowResultModal(true);
                }
              }
            ]
          );
        }
      } catch (error) {
        console.error('[TRY_ON] ❌ Error loading saved data:', error);
      }
    };
    
    loadSavedData();
  }, []);

  // Save data when it changes
  useEffect(() => {
    const saveData = async () => {
      // Only save if we have some data
      if (tryOnData.selectedPersonImage || tryOnData.selectedDressImage || tryOnData.dressDescription) {
        try {
          await storageService.saveTryOnData(tryOnData);
        } catch (error) {
          console.error('[TRY_ON] ❌ Error saving data:', error);
        }
      }
    };
    
    saveData();
  }, [tryOnData]);

  const handlePersonImageSelect = (imageUrl: string) => {
    setTryOnData(prev => ({ ...prev, selectedPersonImage: imageUrl }));
  };

  const handleDressImageSelect = (imageUrl: string, description?: string) => {
    setTryOnData(prev => ({ 
      ...prev, 
      selectedDressImage: imageUrl,
      dressDescription: description 
    }));
  };

  const handleTryOnCreate = async (tryOnId: string) => {
    try {
      // Save active try-on to storage
      await storageService.saveActiveTryOn(tryOnId);
      
      setCurrentTryOnId(tryOnId);
      setShowResultModal(true);
    } catch (error) {
      console.error('[TRY_ON] ❌ Error saving active try-on:', error);
      // Still show the modal even if saving fails
      setCurrentTryOnId(tryOnId);
      setShowResultModal(true);
    }
  };

  const handleResultModalClose = async () => {
    try {
      // Remove from active try-ons when closing
      if (currentTryOnId) {
        await storageService.removeActiveTryOn(currentTryOnId);
      }
    } catch (error) {
      console.error('[TRY_ON] ❌ Error removing active try-on:', error);
    } finally {
      setShowResultModal(false);
      setCurrentTryOnId(null);
    }
  };

  const handleRetry = async () => {
    try {
      // Remove from active try-ons when retrying
      if (currentTryOnId) {
        await storageService.removeActiveTryOn(currentTryOnId);
      }
    } catch (error) {
      console.error('[TRY_ON] ❌ Error removing active try-on:', error);
    } finally {
      setShowResultModal(false);
      setCurrentTryOnId(null);
      // Keep the form data for retry
    }
  };

  const handleClearForm = async () => {
    try {
      await storageService.clearTryOnData();
      setTryOnData({
        selectedPersonImage: undefined,
        selectedDressImage: undefined,
        dressDescription: undefined,
      });
    } catch (error) {
      console.error('[TRY_ON] ❌ Error clearing form:', error);
    }
  };

  const handleFormReset = () => {
    // Reset the form state immediately
    setTryOnData({
      selectedPersonImage: undefined,
      selectedDressImage: undefined,
      dressDescription: undefined,
    });
  };

  const isReadyToCreate = !!(tryOnData.selectedPersonImage && 
    (tryOnData.selectedDressImage || tryOnData.dressDescription));

  return (
    <PageWrapper>
      <ScrollView>
        <SectionWrapper>
          <PageHeader title="Virtual Try-On" subtitle="Upload your photo and see how clothes look on you before you buy!" />
        </SectionWrapper>

        <SectionWrapper className="p-6 bg-gray-100 my-8 mx-4 rounded-2xl">
          <PersonModal 
            onImageSelect={handlePersonImageSelect}
            selectedImage={tryOnData.selectedPersonImage}
          />
        </SectionWrapper>

        <SectionWrapper className="p-6 bg-gray-100 my-8 mx-4 rounded-2xl">
          <DressModal 
            onImageSelect={handleDressImageSelect}
            selectedImage={tryOnData.selectedDressImage}
            selectedDescription={tryOnData.dressDescription}
          />
        </SectionWrapper>

        <SectionWrapper className="p-6">
          <CreateButton 
            isReady={isReadyToCreate}
            tryOnData={tryOnData}
            onTryOnCreate={handleTryOnCreate}
          />
        </SectionWrapper>
        
        <Footer />
      </ScrollView>

      <ResultModal
        visible={showResultModal}
        tryOnId={currentTryOnId}
        onClose={handleResultModalClose}
        onRetry={handleRetry}
        onClearForm={handleFormReset}
      />
    </PageWrapper>
  );
};

export default TryOn;
