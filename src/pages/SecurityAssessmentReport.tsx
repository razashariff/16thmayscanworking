
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Shield, FileText, PieChart, Download, Loader, ArrowRight, 
  CheckCircle, AlertCircle, XCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PieChart as RechartsChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Tables } from '@/integrations/supabase/types';

type SecurityAssessment = Tables<"security_assessments">;
type Question = Tables<"security_assessment_questions">;
type Category = Tables<"security_assessment_categories">;
type Response = Tables<"assessment_responses">;

interface QuestionWithCategory extends Question {
  category: Category;
}

interface ResponseWithQuestion extends Response {
  question: QuestionWithCategory;
}

interface CategoryScore {
  id: string;
  name: string;
  score: number;
  implemented: number;
  inProgress: number;
  notImplemented: number;
  weight: number;
}

const SecurityAssessmentReport = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<SecurityAssessment | null>(null);
  const [responses, setResponses] = useState<ResponseWithQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryScores, setCategoryScores] = useState<CategoryScore[]>([]);

  useEffect(() => {
    const fetchAssessmentData = async () => {
      if (!assessmentId) return;

      try {
        // Fetch the assessment
        const { data: assessmentData, error: assessmentError } = await supabase
          .from('security_assessments')
          .select('*')
          .eq('id', assessmentId)
          .single();

        if (assessmentError) throw assessmentError;
        if (!assessmentData) {
          toast.error('Assessment not found');
          navigate('/security-assessment');
          return;
        }

        if (!assessmentData.completed) {
          toast.info('This assessment is not complete yet');
          navigate(`/security-assessment/${assessmentId}`);
          return;
        }

        setAssessment(assessmentData);

        // Fetch responses with questions and categories
        const { data: responsesData, error: responsesError } = await supabase
          .from('assessment_responses')
          .select(`
            *,
            question:question_id (
              *,
              category:category_id (*)
            )
          `)
          .eq('assessment_id', assessmentId);

        if (responsesError) throw responsesError;
        
        // Cast to the correct type
        const typedResponses = responsesData as unknown as ResponseWithQuestion[];
        setResponses(typedResponses);

        // Calculate category scores
        const categories = new Map<string, CategoryScore>();
        
        typedResponses.forEach(response => {
          const category = response.question.category;
          const categoryId = category.id;
          
          if (!categories.has(categoryId)) {
            categories.set(categoryId, {
              id: categoryId,
              name: category.name,
              score: 0,
              implemented: 0,
              inProgress: 0,
              notImplemented: 0,
              weight: category.weight || 1
            });
          }
          
          const categoryScore = categories.get(categoryId)!;
          const questionWeight = response.question.weight || 1;
          
          if (response.status === 'IN_PLACE') {
            categoryScore.implemented += questionWeight;
            categoryScore.score += questionWeight;
          } else if (response.status === 'IN_PROGRESS') {
            categoryScore.inProgress += questionWeight;
            categoryScore.score += questionWeight * 0.5;
          } else {
            categoryScore.notImplemented += questionWeight;
          }
        });
        
        // Calculate final scores for each category
        categories.forEach(category => {
          const totalWeight = category.implemented + category.inProgress + category.notImplemented;
          category.score = totalWeight > 0 ? (category.score / totalWeight) * 100 : 0;
        });
        
        setCategoryScores(Array.from(categories.values()).sort((a, b) => b.weight - a.weight));

      } catch (error) {
        console.error('Error fetching assessment data:', error);
        toast.error('Failed to load assessment report');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessmentData();
  }, [assessmentId, navigate]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'IN_PLACE':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'IN_PROGRESS':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'NOT_IN_PLACE':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'IN_PLACE':
        return 'In Place';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'NOT_IN_PLACE':
        return 'Not In Place';
      default:
        return 'Unknown';
    }
  };

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'IN_PLACE':
        return 'text-green-500';
      case 'IN_PROGRESS':
        return 'text-amber-500';
      case 'NOT_IN_PLACE':
        return 'text-red-500';
      default:
        return 'text-cyber-muted';
    }
  };

  const getGradeColor = (grade?: string) => {
    switch (grade) {
      case 'A': return "text-green-500";
      case 'B': return "text-blue-500";
      case 'C': return "text-orange-500";
      default: return "text-cyber-muted";
    }
  };

  const exportReport = () => {
    // This would be implemented to generate a PDF or other format for exporting
    toast.info('Report export functionality will be available soon');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-cyber-dark text-cyber-text">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader className="h-16 w-16 text-cyber-neon animate-spin mb-4" />
            <p className="text-cyber-muted">Loading assessment report...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const pieData = [
    { name: 'Implemented', value: responses.filter(r => r.status === 'IN_PLACE').length, color: '#22c55e' },
    { name: 'In Progress', value: responses.filter(r => r.status === 'IN_PROGRESS').length, color: '#f59e0b' },
    { name: 'Not Implemented', value: responses.filter(r => r.status === 'NOT_IN_PLACE').length, color: '#ef4444' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-cyber-dark text-cyber-text">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12 flex-grow">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FileText size={28} className="text-cyber-neon" />
            <h1 className="text-3xl font-bold gradient-text">Security Assessment Report</h1>
          </div>
          
          {assessment && (
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-3">
              <p className="text-cyber-muted">
                Organization: <span className="text-cyber-text font-medium">{assessment.organization_name}</span>
              </p>
              <div className="flex flex-wrap gap-3 items-center">
                <span className="text-sm text-cyber-muted">
                  Completed: {new Date(assessment.updated_at).toLocaleDateString()}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/security-assessment')}
                  className="border-cyber-neon/30 hover:bg-cyber-neon/10"
                >
                  Back to Assessments
                </Button>
                <Button 
                  onClick={exportReport}
                  className="bg-gradient-to-r from-cyber-blue to-cyber-purple hover:from-cyber-purple hover:to-cyber-blue"
                  size="sm"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </div>
            </div>
          )}
        </div>

        {assessment && (
          <div className="glass-panel p-6 rounded-xl border border-cyber-neon/20 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-bold mb-4">Overall Security Score</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-cyber-muted">Score:</span>
                    <div className="flex items-center">
                      <span className="text-3xl font-bold text-cyber-neon">{assessment.score?.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-cyber-muted">Grade:</span>
                    <span className={`text-3xl font-bold ${getGradeColor(assessment.grade)}`}>
                      {assessment.grade}
                    </span>
                  </div>
                  <div className="pt-3">
                    <h3 className="text-sm font-medium mb-2">Summary:</h3>
                    <p className="text-cyber-muted">
                      {assessment.score && assessment.score >= 90 && (
                        "Your organization demonstrates excellent security practices. Continue maintaining these high standards and stay vigilant against emerging threats."
                      )}
                      {assessment.score && assessment.score >= 75 && assessment.score < 90 && (
                        "Your organization has solid security foundations in place, but there are areas that need attention to strengthen your overall security posture."
                      )}
                      {assessment.score && assessment.score < 75 && (
                        "Your organization has significant security gaps that should be addressed promptly to reduce vulnerability to potential threats."
                      )}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({name, value}) => `${name}: ${value}`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} controls`, 'Count']} />
                      <Legend />
                    </RechartsChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Category Scores</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {categoryScores.map(category => (
              <div key={category.id} className="glass-panel p-4 rounded-xl border border-cyber-purple/20">
                <h3 className="font-medium mb-2">{category.name}</h3>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-cyber-muted">Score:</span>
                  <span className="font-medium">{category.score.toFixed(1)}%</span>
                </div>
                <div className="w-full h-2 bg-cyber-dark/50 rounded-full overflow-hidden mb-3">
                  <div 
                    className="h-full bg-gradient-to-r from-cyber-blue to-cyber-purple" 
                    style={{ width: `${category.score}%` }}
                  ></div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="flex flex-col items-center">
                    <span className="text-green-500 font-medium">{category.implemented}</span>
                    <span className="text-cyber-muted">Implemented</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-amber-500 font-medium">{category.inProgress}</span>
                    <span className="text-cyber-muted">In Progress</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-red-500 font-medium">{category.notImplemented}</span>
                    <span className="text-cyber-muted">Not Implemented</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Detailed Assessment</h2>
          
          {categoryScores.map(category => (
            <div key={category.id} className="mb-8">
              <h3 className="text-lg font-medium text-cyber-neon mb-3">{category.name}</h3>
              
              <div className="space-y-4">
                {responses
                  .filter(response => response.question.category.id === category.id)
                  .sort((a, b) => {
                    // Sort by criticality (CRITICAL > MAJOR > MINOR)
                    const criticalityOrder = { CRITICAL: 0, MAJOR: 1, MINOR: 2 };
                    const aOrder = criticalityOrder[a.question.criticality as keyof typeof criticalityOrder] || 3;
                    const bOrder = criticalityOrder[b.question.criticality as keyof typeof criticalityOrder] || 3;
                    
                    if (aOrder !== bOrder) return aOrder - bOrder;
                    
                    // Then sort by status (NOT_IN_PLACE > IN_PROGRESS > IN_PLACE)
                    const statusOrder = { NOT_IN_PLACE: 0, IN_PROGRESS: 1, IN_PLACE: 2 };
                    const aStatusOrder = statusOrder[a.status as keyof typeof statusOrder] || 3;
                    const bStatusOrder = statusOrder[b.status as keyof typeof statusOrder] || 3;
                    
                    return aStatusOrder - bStatusOrder;
                  })
                  .map(response => (
                    <div key={response.id} className="glass-panel p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <div className="flex gap-2 items-center">
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            response.question.criticality === 'CRITICAL' 
                              ? 'bg-red-950/30 text-red-400' 
                              : response.question.criticality === 'MAJOR'
                                ? 'bg-amber-950/30 text-amber-400'
                                : 'bg-blue-950/30 text-blue-400'
                          }`}>
                            {response.question.criticality}
                          </span>
                          <span className="text-sm font-medium">{response.question.text}</span>
                        </div>
                        <div className={`flex items-center gap-1 ${getStatusColorClass(response.status)}`}>
                          {getStatusIcon(response.status)}
                          <span className="text-sm">{getStatusText(response.status)}</span>
                        </div>
                      </div>
                      
                      {response.question.description && (
                        <p className="text-xs text-cyber-muted">{response.question.description}</p>
                      )}
                      
                      {/* Recommendations based on status */}
                      {response.status !== 'IN_PLACE' && (
                        <div className="mt-2 pt-2 border-t border-cyber-neon/10">
                          <p className="text-xs text-cyber-muted">
                            <span className="text-cyber-neon">Recommendation: </span>
                            {response.status === 'IN_PROGRESS' ? (
                              `Continue implementing ${response.question.text.toLowerCase()} to strengthen your security posture.`
                            ) : (
                              `Consider implementing ${response.question.text.toLowerCase()} as a security priority.`
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 pt-8 border-t border-cyber-neon/20">
          <h2 className="text-xl font-bold mb-4">Next Steps</h2>
          <div className="glass-panel p-6 rounded-xl">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-cyber-purple/20 flex items-center justify-center text-cyber-neon flex-shrink-0">1</div>
                <div>
                  <h3 className="font-medium">Address Critical Vulnerabilities</h3>
                  <p className="text-sm text-cyber-muted">Focus on implementing security controls for any critical areas marked as "Not In Place"</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-cyber-purple/20 flex items-center justify-center text-cyber-neon flex-shrink-0">2</div>
                <div>
                  <h3 className="font-medium">Complete In-Progress Implementations</h3>
                  <p className="text-sm text-cyber-muted">Finalize security measures that are currently being implemented</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-cyber-purple/20 flex items-center justify-center text-cyber-neon flex-shrink-0">3</div>
                <div>
                  <h3 className="font-medium">Schedule Regular Reassessments</h3>
                  <p className="text-sm text-cyber-muted">Plan to reassess your security posture quarterly to track improvements</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-cyber-neon/10">
                <Button
                  onClick={() => navigate('/security-scan')}
                  className="bg-gradient-to-r from-cyber-blue to-cyber-purple hover:from-cyber-purple hover:to-cyber-blue"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Run a Vulnerability Scan
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SecurityAssessmentReport;
