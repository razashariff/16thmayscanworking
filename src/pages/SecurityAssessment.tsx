
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Shield, ClipboardList, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tables } from '@/integrations/supabase/types';

type SecurityAssessment = Tables<"security_assessments">;

const SecurityAssessment = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [organizationName, setOrganizationName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recentAssessments, setRecentAssessments] = useState<SecurityAssessment[]>([]);
  
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUser(data.session.user);
        fetchRecentAssessments(data.session.user.id);
      }
    };
    
    getUser();
  }, []);

  const fetchRecentAssessments = async (userId: string) => {
    const { data, error } = await supabase
      .from('security_assessments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching assessments:', error);
    } else {
      setRecentAssessments(data || []);
    }
  };

  const startAssessment = async () => {
    if (!organizationName.trim()) {
      toast.error('Please enter your organization name');
      return;
    }

    setIsLoading(true);

    try {
      // Create a new assessment
      const { data, error } = await supabase
        .from('security_assessments')
        .insert({
          organization_name: organizationName,
          user_id: user?.id || null,
          completed: false
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Assessment created successfully!');
      navigate(`/security-assessment/${data.id}`);
    } catch (error) {
      console.error('Error creating assessment:', error);
      toast.error('Failed to create assessment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const viewAssessment = (id: string) => {
    navigate(`/security-assessment/${id}`);
  };

  const viewReport = (id: string) => {
    navigate(`/security-assessment-report/${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-cyber-dark text-cyber-text">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12 flex-grow">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <ClipboardList size={28} className="text-cyber-neon" />
            <h1 className="text-3xl font-bold gradient-text">Security Assessment Portal</h1>
          </div>
          <p className="text-cyber-muted max-w-2xl">
            Evaluate the security posture of your SaaS service or website. Answer our comprehensive questionnaire
            to receive a detailed security assessment and risk analysis report.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-panel p-6 rounded-xl border border-cyber-neon/20">
            <h2 className="text-xl font-bold mb-4">Start a New Assessment</h2>
            <p className="text-cyber-muted mb-6">
              Begin by entering your organization name. You'll then be guided through a series of security questions 
              covering multiple domains including authentication, data protection, network security, and more.
            </p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="org-name" className="block text-sm font-medium mb-2">Organization Name</label>
                <Input 
                  id="org-name"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder="Enter your organization name"
                  className="bg-cyber-dark/60 border-cyber-neon/30 text-cyber-text"
                />
              </div>
              
              <Button 
                onClick={startAssessment} 
                disabled={isLoading} 
                className="w-full bg-gradient-to-r from-cyber-blue to-cyber-purple hover:from-cyber-purple hover:to-cyber-blue"
              >
                Start Security Assessment
              </Button>
            </div>
          </div>
          
          <div className="glass-panel p-6 rounded-xl border border-cyber-neon/20">
            <h2 className="text-xl font-bold mb-4">What to Expect</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-cyber-purple/20 flex items-center justify-center text-cyber-neon">1</div>
                <div>
                  <h3 className="font-medium">Answer Security Questions</h3>
                  <p className="text-sm text-cyber-muted">Complete a thorough questionnaire covering essential security domains</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-cyber-purple/20 flex items-center justify-center text-cyber-neon">2</div>
                <div>
                  <h3 className="font-medium">Receive a Security Score</h3>
                  <p className="text-sm text-cyber-muted">Get a weighted score based on your security implementations</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-cyber-purple/20 flex items-center justify-center text-cyber-neon">3</div>
                <div>
                  <h3 className="font-medium">View Detailed Reports</h3>
                  <p className="text-sm text-cyber-muted">Access comprehensive reports with recommendations for improvement</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-cyber-purple/20 flex items-center justify-center text-cyber-neon">4</div>
                <div>
                  <h3 className="font-medium">Track Security Progress</h3>
                  <p className="text-sm text-cyber-muted">Monitor your security posture improvements over time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {recentAssessments.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6">Your Recent Assessments</h2>
            <div className="grid gap-4">
              {recentAssessments.map((assessment) => (
                <div key={assessment.id} className="glass-panel p-4 rounded-xl border border-cyber-purple/20 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{assessment.organization_name}</h3>
                    <div className="flex items-center gap-4 text-sm text-cyber-muted mt-1">
                      <span>Created: {new Date(assessment.created_at).toLocaleDateString()}</span>
                      {assessment.completed && (
                        <>
                          <span>·</span>
                          <span className="flex items-center">
                            Score: <span className="text-cyber-neon ml-1 font-medium">{assessment.score?.toFixed(1)}%</span>
                          </span>
                          <span>·</span>
                          <span className="flex items-center">
                            Grade: <span className={`ml-1 font-medium ${
                              assessment.grade === 'A' ? 'text-green-500' : 
                              assessment.grade === 'B' ? 'text-blue-500' : 'text-orange-500'
                            }`}>{assessment.grade}</span>
                          </span>
                        </>
                      )}
                      {!assessment.completed && (
                        <span className="flex items-center gap-1 text-amber-500">
                          <AlertTriangle size={14} /> Incomplete
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!assessment.completed && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewAssessment(assessment.id)}
                        className="border-cyber-neon/30 hover:bg-cyber-neon/10"
                      >
                        Continue
                      </Button>
                    )}
                    {assessment.completed && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewReport(assessment.id)}
                        className="border-cyber-neon/30 hover:bg-cyber-neon/10"
                      >
                        View Report
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SecurityAssessment;
