
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Shield, ClipboardCheck, AlertTriangle, Loader, CheckCircle, Circle, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Progress } from '@/components/ui/progress';
import { Tables } from '@/integrations/supabase/types';

type SecurityAssessment = Tables<"security_assessments">;
type Question = Tables<"security_assessment_questions">;
type Category = Tables<"security_assessment_categories">;
type Response = Tables<"assessment_responses">;

interface QuestionWithCategory extends Question {
  category: Category;
}

const SecurityAssessmentQuestions = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<SecurityAssessment | null>(null);
  const [questions, setQuestions] = useState<QuestionWithCategory[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(0);
  const [grade, setGrade] = useState('C');

  useEffect(() => {
    const fetchAssessment = async () => {
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

        setAssessment(assessmentData);

        // Fetch questions with their categories
        const { data: questionsData, error: questionsError } = await supabase
          .from('security_assessment_questions')
          .select(`
            *,
            category: category_id (*)
          `);

        if (questionsError) throw questionsError;
        
        // Cast to the correct type and sort by criticality
        const typedQuestions = questionsData as unknown as QuestionWithCategory[];
        const sortedQuestions = typedQuestions.sort((a, b) => {
          const criticalityOrder = { "CRITICAL": 1, "MAJOR": 2, "MINOR": 3 };
          return criticalityOrder[a.criticality as keyof typeof criticalityOrder] - 
                 criticalityOrder[b.criticality as keyof typeof criticalityOrder];
        });
        
        setQuestions(sortedQuestions);

        // Fetch existing responses
        const { data: responsesData, error: responsesError } = await supabase
          .from('assessment_responses')
          .select('*')
          .eq('assessment_id', assessmentId);

        if (responsesError) throw responsesError;

        // Convert responses to a map
        const responseMap: Record<string, string> = {};
        responsesData.forEach((response) => {
          responseMap[response.question_id] = response.status;
        });
        
        setResponses(responseMap);
        
        // Calculate progress
        const answeredCount = responsesData.length;
        const totalQuestions = questionsData.length;
        setProgress(totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0);

        // Calculate score if we already have responses
        if (responsesData.length > 0) {
          calculateCurrentScore(responseMap, sortedQuestions);
        }

      } catch (error) {
        console.error('Error fetching assessment data:', error);
        toast.error('Failed to load assessment data');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [assessmentId, navigate]);

  const calculateCurrentScore = (currentResponses: Record<string, string>, questionsList: QuestionWithCategory[]) => {
    let totalWeight = 0;
    let weightedScore = 0;
    
    questionsList.forEach(question => {
      const weight = question.weight || 1;
      totalWeight += weight;
      
      const response = currentResponses[question.id];
      if (response === 'IN_PLACE') {
        weightedScore += weight;
      } else if (response === 'IN_PROGRESS') {
        weightedScore += weight * 0.5;
      }
    });
    
    // Calculate overall score as percentage
    const currentScore = totalWeight > 0 ? (weightedScore / totalWeight) * 100 : 0;
    setScore(currentScore);
    
    // Determine grade
    let currentGrade = 'C';
    if (currentScore >= 90) currentGrade = 'A';
    else if (currentScore >= 75) currentGrade = 'B';
    setGrade(currentGrade);
  };

  const handleResponseChange = async (questionId: string, status: string) => {
    // Update local state immediately for responsive UI
    const updatedResponses = { ...responses, [questionId]: status };
    setResponses(updatedResponses);

    // Recalculate score with updated responses
    calculateCurrentScore(updatedResponses, questions);

    try {
      const { data: existingResponse } = await supabase
        .from('assessment_responses')
        .select()
        .eq('assessment_id', assessmentId)
        .eq('question_id', questionId)
        .maybeSingle();
      
      if (existingResponse) {
        await supabase
          .from('assessment_responses')
          .update({ status })
          .eq('id', existingResponse.id);
      } else {
        await supabase
          .from('assessment_responses')
          .insert({
            assessment_id: assessmentId!,
            question_id: questionId,
            status
          });
      }

      // Update progress
      const answeredCount = Object.keys(updatedResponses).length;
      const totalQuestions = questions.length;
      setProgress(totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0);

    } catch (error) {
      console.error('Error updating response:', error);
      toast.error('Failed to save your response');
    }
  };

  const calculateResults = async () => {
    if (!assessmentId || !assessment) return;
    
    const answeredCount = Object.keys(responses).length;
    const totalQuestions = questions.length;
    
    if (answeredCount < totalQuestions) {
      toast.error(`Please answer all questions (${answeredCount}/${totalQuestions} completed)`);
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Calculate score based on weighted responses
      let totalWeight = 0;
      let weightedScore = 0;
      const categories = new Map<string, { categoryId: string, totalWeight: number, weightedScore: number }>();
      
      questions.forEach(question => {
        const categoryId = question.category_id;
        const weight = question.weight || 1;
        totalWeight += weight;
        
        if (!categories.has(categoryId)) {
          categories.set(categoryId, { categoryId, totalWeight: 0, weightedScore: 0 });
        }
        
        const category = categories.get(categoryId)!;
        category.totalWeight += weight;
        
        const response = responses[question.id];
        if (response === 'IN_PLACE') {
          weightedScore += weight;
          category.weightedScore += weight;
        } else if (response === 'IN_PROGRESS') {
          weightedScore += weight * 0.5;
          category.weightedScore += weight * 0.5;
        }
      });
      
      // Calculate overall score as percentage
      const finalScore = totalWeight > 0 ? (weightedScore / totalWeight) * 100 : 0;
      
      // Determine grade
      let finalGrade = 'C';
      if (finalScore >= 90) finalGrade = 'A';
      else if (finalScore >= 75) finalGrade = 'B';
      
      // Update assessment with score and grade
      await supabase
        .from('security_assessments')
        .update({
          score: finalScore,
          grade: finalGrade,
          completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', assessmentId);
      
      toast.success('Assessment completed successfully!');
      navigate(`/security-assessment-report/${assessmentId}`);
      
    } catch (error) {
      console.error('Error calculating results:', error);
      toast.error('Failed to calculate assessment results');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-cyber-dark text-cyber-text">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader className="h-16 w-16 text-cyber-neon animate-spin mb-4" />
            <p className="text-cyber-muted">Loading assessment questions...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cyber-dark text-cyber-text">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12 flex-grow">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <ClipboardCheck size={28} className="text-cyber-neon" />
            <h1 className="text-3xl font-bold gradient-text">Security Assessment</h1>
          </div>
          
          {assessment && (
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-3">
              <p className="text-cyber-muted">
                Organization: <span className="text-cyber-text font-medium">{assessment.organization_name}</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className="flex items-center gap-2">
                  <div className="w-24">Progress:</div>
                  <Progress value={progress} className="w-32 h-2" />
                  <span className="text-sm">{Math.round(progress)}%</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/security-assessment')}
                  className="border-cyber-neon/30 hover:bg-cyber-neon/10"
                >
                  Back to Assessments
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8 mb-8">
          {questions.map((question) => (
            <div key={question.id} className="glass-panel p-6 rounded-xl border border-cyber-neon/20">
              <div className="flex gap-2 items-center mb-3">
                <span className={`px-2.5 py-0.5 text-xs rounded-full ${
                  question.criticality === 'CRITICAL' 
                    ? 'bg-red-950/30 text-red-400' 
                    : question.criticality === 'MAJOR'
                      ? 'bg-amber-950/30 text-amber-400'
                      : 'bg-blue-950/30 text-blue-400'
                }`}>
                  {question.criticality}
                </span>
                <span className="text-sm text-cyber-muted">{question.category?.name}</span>
              </div>
              
              <h3 className="text-xl font-medium mb-2">{question.text}</h3>
              {question.description && (
                <p className="text-sm text-cyber-muted mb-4">{question.description}</p>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                <Button
                  variant="outline"
                  onClick={() => handleResponseChange(question.id, 'IN_PLACE')}
                  className={`justify-start gap-2 ${
                    responses[question.id] === 'IN_PLACE'
                      ? 'bg-green-950/20 text-green-400 border-green-500/30'
                      : 'border-cyber-neon/30 hover:bg-cyber-neon/10'
                  }`}
                >
                  {responses[question.id] === 'IN_PLACE' ? 
                    <CheckCircle className="h-4 w-4" /> : 
                    <Circle className="h-4 w-4" />}
                  In Place
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleResponseChange(question.id, 'IN_PROGRESS')}
                  className={`justify-start gap-2 ${
                    responses[question.id] === 'IN_PROGRESS'
                      ? 'bg-blue-950/20 text-blue-400 border-blue-500/30'
                      : 'border-cyber-neon/30 hover:bg-cyber-neon/10'
                  }`}
                >
                  {responses[question.id] === 'IN_PROGRESS' ? 
                    <CheckCircle className="h-4 w-4" /> : 
                    <Circle className="h-4 w-4" />}
                  In Progress
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleResponseChange(question.id, 'NOT_IN_PLACE')}
                  className={`justify-start gap-2 ${
                    responses[question.id] === 'NOT_IN_PLACE'
                      ? 'bg-red-950/20 text-red-400 border-red-500/30'
                      : 'border-cyber-neon/30 hover:bg-cyber-neon/10'
                  }`}
                >
                  {responses[question.id] === 'NOT_IN_PLACE' ? 
                    <CheckCircle className="h-4 w-4" /> : 
                    <Circle className="h-4 w-4" />}
                  Not In Place
                </Button>
              </div>
              
              <div className="mt-3 flex items-center justify-end">
                <div className="flex items-center text-xs text-cyber-muted">
                  <span>Weight: {question.weight}</span>
                  <HelpCircle className="h-3 w-3 ml-1" aria-label="Higher weight means this question impacts your security score more significantly" />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="glass-panel p-6 rounded-xl border border-cyber-neon/20 mb-8">
          <h3 className="text-xl font-bold mb-4 gradient-text">Assessment Results</h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm text-cyber-muted mb-2">Score</h4>
              <div className="text-4xl font-bold">{score.toFixed(2)}%</div>
            </div>
            <div>
              <h4 className="text-sm text-cyber-muted mb-2">Grade</h4>
              <div className={`text-4xl font-bold ${
                grade === 'A' ? 'text-green-400' : 
                grade === 'B' ? 'text-blue-400' : 
                'text-amber-400'
              }`}>
                {grade}
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-cyber-muted">
              Required to generate report:
            </p>
            <ul className="text-sm list-disc list-inside mt-2 space-y-1">
              <li className={assessment?.organization_name ? "text-green-400" : "text-red-400"}>
                Organization name {assessment?.organization_name ? "✓" : "✗"}
              </li>
              <li className={Object.keys(responses).length === questions.length ? "text-green-400" : "text-red-400"}>
                All questions answered ({Object.keys(responses).length}/{questions.length})
              </li>
            </ul>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-sm text-cyber-muted">
            {Object.keys(responses).length} of {questions.length} questions answered
          </p>
          
          <Button 
            onClick={calculateResults} 
            disabled={submitting || Object.keys(responses).length < questions.length} 
            className="bg-gradient-to-r from-cyber-blue to-cyber-purple hover:from-cyber-purple hover:to-cyber-blue"
          >
            {submitting ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Shield className="mr-2 h-4 w-4" />}
            Generate Security Report
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SecurityAssessmentQuestions;
