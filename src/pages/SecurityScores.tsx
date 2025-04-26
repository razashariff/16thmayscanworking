
import React from 'react';
import ProductList from '@/components/ProductList';
import { Card } from '@/components/ui/card';

const SecurityScores = () => {
  return (
    <div className="min-h-screen bg-cyber-dark text-cyber-text p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 gradient-text">AI Tools Security Scores</h1>
        <div className="max-w-4xl">
          <p className="text-lg mb-12 text-cyber-muted">
            Comprehensive security analysis and detailed reviews of leading AI tools.
            Our expert assessments help you make informed decisions about the security
            features of various AI platforms.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductList showSecurityButton={false} />
        </div>
      </div>
    </div>
  );
};

export default SecurityScores;
