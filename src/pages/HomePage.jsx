import React from 'react';
import Hero from '../components/home/Hero.jsx';
import FeaturedDishes from '../components/home/FeaturedDishes.jsx';
import RestaurantStory from '../components/home/RestaurantStory.jsx';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  return (
    <main className="home-page">
      <Hero />
      <FeaturedDishes />
      <RestaurantStory />
      <section className="home-invitation" aria-labelledby="home-invitation-title">
        <div className="container home-invitation__inner">
          <div>
            <p className="category-label">Le plaisir continue</p>
            <h2 id="home-invitation-title">Une envie en tête ?</h2>
          </div>
          <Link to="/menu" className="btn btn--primary btn--lg">
            Composer ma commande <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
