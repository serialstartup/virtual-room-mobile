import { View, Text, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import PageWrapper from '../../components/PageWrapper'
import { Footer } from '../../components/Footer'
import Hero from '@/components/home/Hero'
import Benefits from '@/components/home/Benefits'
import ReadyButton from '@/components/home/ReadyButton'
import HowItsWorks from '@/components/home/HowItsWorks'
import { SectionWrapper } from '@/components'
const Home = () => {
  const router = useRouter()
  const [currentPage] = useState('home')

  const handleNavigate = (page: string) => {
    switch (page) {
      case 'home':
        router.push('/(tabs)')
        break
      case 'tryon':
        router.push('/(tabs)/try-on')
        break
      case 'wardrobe':
        router.push('/(tabs)/wardrope')
        break
      case 'profile':
        router.push('/(tabs)/profile')
        break
      case 'settings':
        break
      default:
        break
    }
  }

  return (
    <PageWrapper>
      <ScrollView>
        <SectionWrapper padding={0}>
            <Hero />
        </SectionWrapper>

         <SectionWrapper padding={0}>
            <HowItsWorks />
        </SectionWrapper>


         <SectionWrapper padding={0}>
            <Benefits />
        </SectionWrapper>


         <SectionWrapper padding={0}>
            <ReadyButton />
        </SectionWrapper>
        <Footer currentPage={currentPage} onNavigate={handleNavigate} />
      </ScrollView>
    </PageWrapper>
  )
}

export default Home