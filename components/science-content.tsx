"use client";

import { motion } from "framer-motion";
import { SectionLabel, SectionIcons } from "./section-label";
import { BookOpen } from "lucide-react";

export function ScienceContent() {
  const scrollToReferences = () => {
    const referencesSection = document.getElementById("references");
    if (referencesSection) {
      referencesSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-32 pb-8">
        <div className="absolute right-[35%] top-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-radial from-brand/12 via-brand-deep/6 to-transparent blur-[120px] rounded-[50%] opacity-70 animate-[breathing_8s_ease-in-out_infinite]" />

        <div className="relative container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center space-y-6"
          >
            <button
              onClick={scrollToReferences}
              className="inline-block transition-transform hover:scale-105 cursor-pointer"
              aria-label="Scroll to references"
            >
              <SectionLabel icon={SectionIcons.Science}>
                Peer-Reviewed Research
              </SectionLabel>
            </button>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              The Science Behind{" "}
              <span className="bg-gradient-to-r from-brand-light to-brand bg-clip-text text-transparent">
                ThetaMask
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
              Peer-reviewed research on brainwave entrainment for relaxation,
              sleep, and meditation
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative pt-0 pb-16 overflow-hidden">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <p className="text-lg text-slate-300 leading-relaxed">
              The human brain naturally shifts between different electrical
              rhythms depending on what we are doing and how we feel. Slower
              brainwaves, particularly theta and alpha, are most prominent
              during states of deep relaxation, the transition into sleep, and
              meditative awareness. A growing body of research suggests that
              brainwave entrainment can support these naturally occurring states
              by gently encouraging the brain toward rhythms it already uses for
              rest and recovery.
            </p>
          </motion.div>

          {/* Section: Relaxation and Reduced Stress */}
          <ContentSection title="Relaxation and Reduced Stress" delay={0.2}>
            <p className="text-slate-300 leading-relaxed mb-4">
              During relaxation, the brain typically moves away from fast, alert
              rhythms and toward slower activity. For instance, Jacobs &
              Friedman (2004) found that relaxation interventions reliably
              produce higher theta power compared to control conditions,
              suggesting that theta reflects a reduction in central nervous
              system arousal consistent with relaxation.
            </p>
            <p className="text-slate-300 leading-relaxed mb-4">
              By utilizing brainwave entrainment, we can help guide the brain
              into states with stronger slow waves, which a growing body of
              research suggests are linked to beneficial effects. A large
              sample, randomized controlled study, brainwave entrainment led to
              improvements in self-reported mood, including reductions in
              tension, fatigue, and anxious feelings (Johnson et al., 2024). In
              another controlled, double-blind study, auditory brainwave
              entrainment was found to increase heart rate variability, which is
              a well-established indicator of stress reduction.
            </p>
            <p className="text-slate-300 leading-relaxed">
              In a separate study involving a high-stress population, brainwave
              entrainment produced calming effects that approached those seen
              with traditional treatments, while not serving as a replacement
              for them (Cone et al., 2025). Together, these findings suggest
              that supporting theta activity can help the brain shift into a
              calmer, more relaxed state.
            </p>
          </ContentSection>

          {/* Section: Theta Waves, Sleep Onset, and Sleep Quality */}
          <ContentSection
            title="Theta Waves, Sleep Onset, and Sleep Quality"
            delay={0.3}
          >
            <p className="text-slate-300 leading-relaxed mb-4">
              As we prepare for sleep, the brain naturally slows down. Theta
              waves play a central role in this process, as they are strongly
              associated with deep relaxation, drowsiness, and the transition
              from wakefulness into sleep (Bavafa et al., 2021; Diaz et al.,
              2016).
            </p>
            <p className="text-slate-300 leading-relaxed mb-4">
              Strengthening theta activity in the period before bedtime may help
              the brain disengage from active thinking and enter sleep more
              smoothly. Research has shown that stronger theta activity
              facilitates sleep onset by helping the brain "let go" of
              wakefulness and drift into sleep more quickly (Bavafa et al.,
              2021). Entrainment to slower frequencies has also been associated
              with deeper, more restorative sleep. For example, one study found
              that slow-wave entrainment significantly increased time spent in
              Stage 3 deep sleep, the most physically restorative sleep stage
              (Jirakittayakorn & Wongsawat, 2018).
            </p>
            <p className="text-slate-300 leading-relaxed mb-4">
              Several studies have explored brainwave entrainment specifically
              in relation to sleep. In a pilot study by Abeln et al. (2014),
              elite athletes used nighttime entrainment over eight weeks and
              reported significantly better sleep quality and reduced morning
              grogginess compared to a control group. A qualitative study by
              Halpin et al. (2023) further supports these findings. Participants
              using pre-sleep brainwave entrainment described the experience as
              relaxing and easy to use, with perceived benefits such as faster
              sleep onset and fewer nighttime disruptions, and minimal side
              effects reported. While some studies include clinical populations,
              brainwave entrainment is best understood as a tool for supporting
              natural sleep processes rather than as a medical treatment.
            </p>
          </ContentSection>

          {/* Section: Meditation and Inner Awareness */}
          <ContentSection title="Meditation and Inner Awareness" delay={0.4}>
            <p className="text-slate-300 leading-relaxed mb-4">
              Meditation is another state in which slow brainwaves play a
              central role. EEG research consistently shows that theta activity
              increases during meditation compared to quiet rest, reflecting a
              state of relaxed yet focused awareness.
            </p>
            <p className="text-slate-300 leading-relaxed mb-4">
              In nondirective meditation practices, participants exhibit
              significantly higher overall theta power during meditation than
              during rest (Lagopoulos et al., 2009). Similar findings have been
              observed in experienced meditators, who show increased theta
              amplitude during meditation compared to simple relaxation
              (Dobrakowski et al., 2020).
            </p>
            <p className="text-slate-300 leading-relaxed mb-4">
              A particularly well-studied pattern is frontal midline theta,
              which is linked to sustained attention and emotional regulation.
              Studies using Zen meditation have shown that when frontal theta
              activity emerges, markers of nervous system arousal decrease. In
              practical terms, moments of frontal theta coincide with reduced
              heart-rate measures and a subjective sense of relief from anxiety
              and mental strain (Kubota et al., 2001), creating a calmer
              meditative state.
            </p>
            <p className="text-slate-300 leading-relaxed mb-4">
              Recent work further shows that theta entrainment is linked to
              enhanced emotional insight, greater ability to observe thoughts
              with distance, and increased mindful awareness (Cone et al.,
              2025). Lastly, brainwave entrainment has been suggested as an
              accessible "plug-and-play" alternative to meditation, as it
              produces similar effects to a session of meditation (Johnson et
              al., 2024).
            </p>
            <p className="text-slate-300 leading-relaxed">
              These findings suggest that by supporting the brain's natural
              tendency towards the theta rythm, brainwave entrainment can help
              make meditative states more accessible, particularly for those who
              find traditional meditation difficult or hard to sustain.
            </p>
          </ContentSection>

          {/* References Section */}
          <motion.div
            id="references"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
          >
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-brand-light" />
              References
            </h3>
            <div className="space-y-4 text-sm text-slate-400">
              <Reference>
                Aidan Cone, Sam Zuzick, Tiffany Durinski et al. Alpha and Theta
                Audiovisual Interventions in a Reflective Chamber Demonstrate
                Acute Effects on Stress and Burnout, 30 October 2025, PREPRINT
                (Version 1) available at Research Square.{" "}
                <a
                  href="https://doi.org/10.21203/rs.3.rs-7842751/v1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-light hover:text-brand-subtle transition-colors"
                >
                  https://doi.org/10.21203/rs.3.rs-7842751/v1
                </a>
              </Reference>
              <Reference>
                Bavafa, A., Foroughi, A., Jaberghaderi, N., & Khazaei, H.
                (2023). Investigating the efficacy of theta binaural beat on the
                absolute power of theta activity in primary insomniacs.{" "}
                <i>Basic and Clinical Neuroscience, 14</i>(3), 331–340.{" "}
                <a
                  href="https://doi.org/10.32598/bcn.2021.2162.1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-light hover:text-brand-subtle transition-colors"
                >
                  https://doi.org/10.32598/bcn.2021.2162.1
                </a>
              </Reference>
              <Reference>
                Diaz, B. A., Hardstone, R., Mansvelder, H. D., Van Someren, E.
                J., & Linkenkaer-Hansen, K. (2016). Resting-State Subjective
                Experience and EEG Biomarkers Are Associated with Sleep-Onset
                Latency. <i>Frontiers in psychology, 7</i>, 492.{" "}
                <a
                  href="https://doi.org/10.3389/fpsyg.2016.00492"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-light hover:text-brand-subtle transition-colors"
                >
                  https://doi.org/10.3389/fpsyg.2016.00492
                </a>
              </Reference>
              <Reference>
                Dobrakowski, P., Blaszkiewicz, M., & Skalski, S. (2020). Changes
                in the Electrical Activity of the Brain in the Alpha and Theta
                Bands during Prayer and Meditation.{" "}
                <i>
                  International journal of environmental research and public
                  health, 17
                </i>
                (24), 9567.{" "}
                <a
                  href="https://doi.org/10.3390/ijerph17249567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-light hover:text-brand-subtle transition-colors"
                >
                  https://doi.org/10.3390/ijerph17249567
                </a>
              </Reference>
              <Reference>
                Halpin, S. J., Tang, N. K. Y., Casson, A. J., Jones, A. K. P.,
                O'Connor, R. J., & Sivan, M. (2023). User experiences of
                pre-sleep sensory alpha brainwave entrainment for people with
                chronic pain and sleep disturbance. <i>Pain Management, 13</i>
                (5), 259–270.{" "}
                <a
                  href="https://doi.org/10.2217/pmt-2022-0083"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-light hover:text-brand-subtle transition-colors"
                >
                  https://doi.org/10.2217/pmt-2022-0083
                </a>
              </Reference>
              <Reference>
                Jacobs, G. D., & Friedman, R. (2004). EEG spectral analysis of
                relaxation techniques.{" "}
                <i>Applied psychophysiology and biofeedback, 29</i>(4), 245–254.{" "}
                <a
                  href="https://doi.org/10.1007/s10484-004-0385-2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-light hover:text-brand-subtle transition-colors"
                >
                  https://doi.org/10.1007/s10484-004-0385-2
                </a>
              </Reference>
              <Reference>
                Jirakittayakorn, N., & Wongsawat, Y. (2018). A Novel Insight of
                Effects of a 3-Hz Binaural Beat on Sleep Stages During Sleep.{" "}
                <i>Frontiers in human neuroscience, 12</i>, 387.{" "}
                <a
                  href="https://doi.org/10.3389/fnhum.2018.00387"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-light hover:text-brand-subtle transition-colors"
                >
                  https://doi.org/10.3389/fnhum.2018.00387
                </a>
              </Reference>
              <Reference>
                Johnson, M., Simonian, N. & Reggente, N. Lightening the mind
                with audiovisual stimulation as an accessible alternative to
                breath-focused meditation for mood and cognitive enhancement.{" "}
                <i>Sci Rep 14</i>, 25553 (2024).{" "}
                <a
                  href="https://doi.org/10.1038/s41598-024-75943-8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-light hover:text-brand-subtle transition-colors"
                >
                  https://doi.org/10.1038/s41598-024-75943-8
                </a>
              </Reference>
              <Reference>
                Kubota, Y., Sato, W., Toichi, M., Murai, T., Okada, T., Hayashi,
                A., & Sengoku, A. (2001). Frontal midline theta rhythm is
                correlated with cardiac autonomic activities during the
                performance of an attention demanding meditation procedure.{" "}
                <i>Brain research. Cognitive brain research, 11</i>(2), 281–287.{" "}
                <a
                  href="https://doi.org/10.1016/s0926-6410(00)00086-0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-light hover:text-brand-subtle transition-colors"
                >
                  https://doi.org/10.1016/s0926-6410(00)00086-0
                </a>
              </Reference>
              <Reference>
                Lagopoulos, J., Xu, J., Rasmussen, I., Vik, A., Malhi, G. S.,
                Eliassen, C. F., Arntsen, I. E., Saether, J. G., Hollup, S.,
                Holen, A., Davanger, S., & Ellingsen, Ø. (2009). Increased theta
                and alpha EEG activity during nondirective meditation.{" "}
                <i>
                  Journal of alternative and complementary medicine (New York,
                  N.Y.), 15
                </i>
                (11), 1187–1192.{" "}
                <a
                  href="https://doi.org/10.1089/acm.2009.0113"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-light hover:text-brand-subtle transition-colors"
                >
                  https://doi.org/10.1089/acm.2009.0113
                </a>
              </Reference>
              <Reference>
                Tripathi, V., Bhaskar, L., Kharya, C., Bhatia, M., &
                Kochupillai, V. (2025). Unlocking deep relaxation: the power of
                rhythmic breathing on brain rhythms.{" "}
                <i>Npj mental health research, 4</i>(1), 39.{" "}
                <a
                  href="https://doi.org/10.1038/s44184-025-00156-4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-light hover:text-brand-subtle transition-colors"
                >
                  https://doi.org/10.1038/s44184-025-00156-4
                </a>
              </Reference>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// Helper Components
interface ContentSectionProps {
  title: string;
  children: React.ReactNode;
  delay?: number;
}

function ContentSection({ title, children, delay = 0 }: ContentSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="mb-12 p-8 md:p-10 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-slate-700/50 backdrop-blur-sm shadow-2xl"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-brand-light mb-6">
        {title}
      </h2>
      <div className="prose prose-invert max-w-none">{children}</div>
    </motion.div>
  );
}

function Reference({ children }: { children: React.ReactNode }) {
  return (
    <p className="pl-4 border-l-2 border-slate-600 leading-relaxed">
      {children}
    </p>
  );
}
