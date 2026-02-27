import HeroSection from "../components/HeroSection.component"
import AboutSection from "../components/AboutSection.component"
import GallerySection from "../components/GallerySection.component"
import SupportSection from "../components/Support.component"
import Footer from "../../../components/common/Footer"
import Reveal from "../../../components/ui/Reveal"
import ShowcaseSection from "../components/ShowcaseSection.component"
const HomePage = () => {
    return (
        <div className="w-full">

            {/* Hero */}
            <section id="home">
                <Reveal>
                    <HeroSection />
                </Reveal>
            </section>

            {/* About */}
            <section id="about" className="py-24">
                <Reveal>
                    <AboutSection />
                </Reveal>
            </section>

            <section id="gallery" className="py-24 bg-neutral-900/40">
                <Reveal>
                    <GallerySection />
                </Reveal>
            </section>

            {/* Showcase*/}

            <section className="py-24 bg-neutral-950">
                <Reveal>
                <ShowcaseSection />
                    </Reveal>
            </section>

            {/* Support */}
            <section id="support" className="py-24">
                <Reveal>
                    <SupportSection />
                </Reveal>
            </section>

            <Footer />
        </div>
    )
}

export default HomePage