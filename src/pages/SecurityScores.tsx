
import React from 'react';
import ProductList from '@/components/ProductList';
import { Card } from '@/components/ui/card';

const SecurityScores = () => {
  return (
    <div className="min-h-screen bg-cyber-dark text-cyber-text p-8">
      <h1 className="text-4xl font-bold mb-8 gradient-text">AI Tools Security Scores</h1>
      <div className="max-w-4xl mx-auto">
        <p className="text-lg mb-12 text-cyber-muted">
          Comprehensive security analysis and detailed reviews of leading AI tools.
          Our expert assessments help you make informed decisions about the security
          features of various AI platforms.
        </p>
      </div>
      <ProductList />
    </div>
  );
};

export default SecurityScores;
