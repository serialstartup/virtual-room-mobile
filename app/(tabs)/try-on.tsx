import { View, Text } from 'react-native'
import React from 'react'
import Hero from '@/components/try-on/Hero'
import ChooseModal from '@/components/try-on/ChooseModal'
import ChooseClothes from '@/components/try-on/ChooseClothes'
import Result from '@/components/try-on/Result'
import CreateButton from '@/components/try-on/CreateButton'
import { PageWrapper, SectionWrapper } from '@/components'
const TryOn = () => {
  return (
    <PageWrapper>
      <SectionWrapper>
        <Hero />
      </SectionWrapper>

        <SectionWrapper>
        <ChooseModal />
      </SectionWrapper>


        <SectionWrapper>
        <ChooseClothes />
      </SectionWrapper>

        <SectionWrapper>
        <Result />
      </SectionWrapper>

      <SectionWrapper>
        <CreateButton />
      </SectionWrapper>
    </PageWrapper>
  )
}

export default TryOn