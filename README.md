# Bebe-Ai-Real

Small personal repo for the "Bebe Ai Real" project.

Project structure

- README.md — this file.
- LICENSE — MIT license.
- bebe-ai-real.txt — active project notes and next steps (main notes file).
- Bebe Ai Real.txt — legacy placeholder (archived, see archive/).
- src/ — application source code.
- models/ — placeholder for trained models (do not commit large files here).
- data/ — placeholder for datasets (keep out of repo if large files).
- tests/ — unit tests (pytest).

Getting started (Python)

1. Clone the repo
   git clone https://github.com/Lovelaga/Bebe-Ai-Real.git
   cd Bebe-Ai-Real

2. Create a virtual environment and install (optional)
   python -m venv .venv
   source .venv/bin/activate   # macOS/Linux
   .\.venv\Scripts\activate  # Windows
   pip install -r requirements.txt

3. Run the sample script
   python -m src.main

Development notes

- Keep large datasets and model weights out of the repository. Use external storage and reference links in bebe-ai-real.txt.
- Use the `models/` and `data/` directories as placeholders; add README files there describing storage or external locations.

CI

A simple GitHub Actions workflow runs tests with Python on push and pull requests (see .github/workflows/ci.yml).

License

This project is licensed under the MIT License — see LICENSE.

## Environment variables

Add these to your `.env` file locally (do NOT commit real secrets):

ADMIN_EMAIL=beberaygardon32@gmail.com
FREE_USER_CREDITS=50000

Also keep your payment / API keys in environment variables (do NOT commit them):

OPENAI_API_KEY=sk-YourRealKeyHere
STRIPE_SECRET_KEY=sk_live_...
MONGO_URI=your_mongo_url
JWT_SECRET=super_secret_key

Follow the README sections for setup and deployment. If you deploy to Vercel, add these environment variables in the Vercel dashboard or GitHub Actions secrets.
