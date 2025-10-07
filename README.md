Présentation de FreeDev
FreeDev est une plateforme web communautaire dédiée à la mise en relation des développeurs et des professionnels du numérique à travers l’Afrique francophone. Elle vise à favoriser le partage de savoirs, la montée en compétence et la collaboration entre passionnés de technologie.

Objectifs
Connecter les développeurs, designers, data scientists, ingénieurs et autres métiers du numérique

Partager des ressources pédagogiques : cours, tutoriels vidéo, articles, outils open-source

Favoriser l’entraide et la contribution à des projets techniques

Valoriser les talents locaux et les initiatives africaines dans le domaine du digital

Ce que FreeDev propose
Une bibliothèque de ressources techniques (React, Django, DevOps, IA…)

Des profils utilisateurs pour suivre les contributions et les parcours

Un espace de publication pour les formateurs et créateurs de contenu

Des outils collaboratifs pour travailler sur des projets open-source

Un système de recommandation intelligente pour découvrir du contenu pertinent

Stack technologique
Front-End : Vite + React + CSS3

Back-End : Django REST Framework

Base de données : sqlite par defaut

Auth & sécurité : JWT, CORS, gestion des rôles

Déploiement : Docker, CI/CD à venir

Pourquoi FreeDev ?
Parce que l’accès à des ressources de qualité ne devrait pas dépendre de la géographie. FreeDev est conçu pour réduire les barrières, valoriser les talents africains et créer un écosystème numérique durable.



ENGLISH
#  FreeDev — Empowering African Tech Communities

**FreeDev** is a collaborative web platform designed to connect developers and digital professionals across Africa. It fosters knowledge sharing, skill development, and open collaboration through curated resources and community-driven initiatives.

## Mission

To bridge the digital divide by providing accessible, high-quality technical resources and creating a vibrant ecosystem where African tech talent can thrive.

##  What FreeDev Offers

- A growing library of tutorials, courses, and technical guides (React, Django, DevOps, AI, etc.)
- Video content from community experts and educators
- User profiles to showcase contributions and learning paths
- Collaboration tools for open-source projects and mentorship
- Smart recommendations to discover relevant content and peers

##  Tech Stack

| Layer        | Technology                     |

- Front-End
 React + Vite + CSS 3  
Back-End   Django REST Framework
- Database
SQLITE3
- Auth & Roles
JWT, CORS, Role-based access
- Deployment
Docker, CI/CD (coming soon)   

## User Roles

- **Learners**: Access tutorials, track progress, and engage with mentors
- **Creators**: Publish content, share tools, and lead workshops
- **Collaborators**: Contribute to projects, review code, and build together

## Why FreeDev?

Because access to quality tech education should not depend on geography. FreeDev is built to:

- Empower African developers and digital professionals
- Promote open knowledge and inclusive growth
- Showcase local talent and foster global collaboration

## Installation (Dev Mode)

```bash
# Back-End
cd Back-End
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py runserver

# Front-End
cd ../Front-End
npm install
npm run dev
