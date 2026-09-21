/* Blog posts data — add a new post by adding an object to this array.
   id:  unique short slug (used in the URL: blog/post.html?id=my-slug)
   content: plain HTML — feel free to use h2/h3, ul/ol, blockquote, pre/code. */

const blogPosts = [
  {
    id: "innovate-hackathon-pydeia",
    title: "How We Won InnovAIte's Agentic-AI Track with Pydeia",
    date: "2026-09-14",
    readTime: "5 min",
    tags: ["Hackathon", "Agentic AI", "Projects"],
    excerpt: "24 hours, 80 participants, 16 teams — and our team took first place in the Agentic-AI track. Here's what we built and what we learned.",
    content: `
      <p>Somewhere between 2 and 4 AM, the pizza went cold and our demo finally worked on the first try. That's roughly when we knew we had a shot.</p>

      <p>At InnovAIte — Bocconi's 24-hour AI &amp; Entrepreneurship hackathon, organized by BSML and a coalition of student associations — our five-person team took on the <strong>Agentic-AI track</strong> and walked away with first place.</p>

      <h2>The problem</h2>

      <p>The brief: build a solution genuinely useful to students. Our team — Samuele Nicolò Straccialini, Edoardo Paccagnella, Filippo Stella, Alessandro Procoli, and me — chose a problem close to home: <strong>high schoolers in Italy have no good way to pick a bachelor's program</strong>.</p>

      <p>There are hundreds of courses, degrees with near-identical names, and very little honest information about the match between a student's interests and a program's reality.</p>

      <h2>The solution: Pydeia</h2>

      <p>Tired of reading marketing pages? So are they. Pydeia is a conversational AI assistant that:</p>

      <ul>
        <li>Asks about interests, budget, location preferences, and ambitions through a voice-first chat interface;</li>
        <li>Runs a <strong>semantic recommendation system</strong> over real program data, so matches are about actual content, not keywords;</li>
        <li>Distances off the <strong>Agentic AI framework</strong> supplied by the hosts, letting the assistant plan its own exploration as the conversation evolves.</li>
      </ul>

      <p>Architecturally it's a Flask backend with agentic prompts driving the reasoning, a React voice-first front end, and a matching layer built around embeddings rather than string matching.</p>

      <h2>What I'd tell my past self</h2>

      <ul>
        <li><strong>Demo early, demo often.</strong> The first working vertical slice beats a wide but broken feature set.</li>
        <li><strong>Nail the story.</strong> Juries remember the problem and the "why", not the stack.</li>
        <li><strong>Sleep budget aside, energy is a team sport.</strong> Rotate drivers and keep a calm voice — 4 AM code is not the place for heroics.</li>
      </ul>

      <blockquote>The best pitches make the judges feel the user's pain before they see a single line of code.</blockquote>

      <p>Huge thanks to the Datapizza mentors who kept us sane, and to the organizers who pulled off the event. The repo is up on <a href="https://github.com/AielloTommaso/Pydeia" target="_blank" rel="noopener">GitHub</a> if you're curious.</p>
    `
  },
  {
    id: "diffusion-phase-transitions",
    title: "Phase Transitions in Diffusion Models on Hierarchical Data",
    date: "2026-09-07",
    readTime: "7 min",
    tags: ["Research", "Diffusion", "Thesis"],
    excerpt: "A summary of my bachelor's thesis: how does the structure of data change what a Transformer-based denoiser can reconstruct? Deterministic noise, emergent boundaries.",
    content: `
      <p>Standard wisdom says diffusion models are phenomenally good at learning distributions. But <em>which</em> distributions — and how does the <em>structure</em> inside the data change what the model can recover?</p>

      <p>That question — the relation between the structure of data and the learning capacity of diffusion models — was the heart of my bachelor's thesis at Bocconi.</p>

      <h2>The setup</h2>

      <p>I built a <strong>modular framework for generating hierarchical sequences</strong>: data drawn from a controlled grammar that encodes structure at multiple levels — from local token transitions up to long-range, document-level patterns.</p>

      <p>Then I trained <strong>Transformer-based denoisers</strong> on samples corrupted across different noise schedules, varying two dials independently:</p>

      <ul>
        <li><strong>Sparsity</strong> — how much of the space of possible sequences is actually reachable;</li>
        <li><strong>Complexity</strong> — how deep and intricate the hierarchical structure is.</li>
      </ul>

      <h2>What I found</h2>

      <p>Reconstruction quality does not degrade smoothly as structure gets harder between the two means. Instead, across both sparsity and complexity, we observe <strong>sharp transitions</strong> — the analogue of <em>phase transitions</em> in statistical physics.</p>

      <p>Below a threshold of complexity, the denoiser recovers almost perfectly. Cross the threshold, and reconstruction quality falls off a cliff — the model keeps its local accuracy but loses the ability to lock onto the global, hierarchical pattern.</p>

      <p>The effect of sparsity is subtler: restricting the reachable space can actually <em>help</em> the model's learning capacity first, then flip as data becomes too concentrated to carry its own signal.</p>

      <blockquote>There's a line in reconstruction quality that the model crosses sharply — like magnetization snapping to zero at a critical temperature.</blockquote>

      <h2>Tying it to statistical physics</h2>

      <p>Recently I've taken this thread into my current research on <strong>statistical physics and diffusion processes</strong>: analyzing phase selection, transition timescales, and stability in mean-field models like Curie-Weiss and hierarchical systems, using analytical methods from probability and statistical mechanics.</p>

      <p>The thesis was the computational peek at these phenomena; the current work is the attempt to understand them on paper. If data structure behaves like an order parameter, is there a rigorous notion of "critical complexity"? That's the question I'm chasing now.</p>
    `
  }
];