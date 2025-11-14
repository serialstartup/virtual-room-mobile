import { ScrollView } from 'react-native'
import PageWrapper from '../../components/PageWrapper'
import { Footer } from '../../components/Footer'
import Hero from '@/components/home/Hero'
import Benefits from '@/components/home/Benefits'
import ReadyButton from '@/components/home/ReadyButton'
import HowItsWorks from '@/components/home/HowItsWorks'
import { SectionWrapper } from '@/components'
const Home = () => {

  return (
    <PageWrapper withoutTopEdge>
      <ScrollView>
        <SectionWrapper>
            <Hero />
        </SectionWrapper>

         <SectionWrapper>
            <HowItsWorks />
        </SectionWrapper>


         <SectionWrapper>
            <Benefits />
        </SectionWrapper>


         <SectionWrapper>
            <ReadyButton />
        </SectionWrapper>
        <Footer  />
      </ScrollView>
    </PageWrapper>
  )
}

export default Home