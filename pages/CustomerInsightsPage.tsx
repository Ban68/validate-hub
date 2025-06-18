
import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAppContext } from '../hooks/useAppContext';
import { Interview } from '../types';
import InterviewForm from '../components/customer-insights/InterviewForm';
import { UsersIcon, SparklesIcon } from '../constants'; 

const CustomerInsightsPage: React.FC = () => {
  const { interviews, deleteInterview, getInterviewById, apiKeyStatus, generateInterviewSummary } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [interviewToEdit, setInterviewToEdit] = useState<Interview | null>(null);
  const [summarizingId, setSummarizingId] = useState<string | null>(null);

  const openModalForNew = () => {
    setInterviewToEdit(null);
    setIsModalOpen(true);
  };

  const openModalForEdit = (id: string) => {
    const interview = getInterviewById(id);
    if (interview) {
      setInterviewToEdit(interview);
      setIsModalOpen(true);
    }
  };

  const handleGenerateSummary = async (id: string) => {
    if (apiKeyStatus === 'missing') {
        alert("API Key is not configured. Cannot generate summary.");
        return;
    }
    setSummarizingId(id);
    await generateInterviewSummary(id);
    setSummarizingId(null);
  };
  
  const interviewQuota = 10; 
  const progress = Math.min((interviews.length / interviewQuota) * 100, 100);


  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between sm:items-center space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Customer Insights</h1>
          <p className="mt-1 text-sm sm:text-base text-gray-700">
            Log, categorize, and analyze customer interviews to uncover deep insights.
          </p>
        </div>
        <Button onClick={openModalForNew} leftIcon={<UsersIcon className="h-5 w-5 mr-1 sm:mr-2"/>} className="w-full sm:w-auto">
          Log New Interview
        </Button>
      </header>

      <Card title="Interview Quota Tracker">
        <p className="text-sm text-gray-800 mb-2">
          Aim to talk to enough people! Recommended: {interviewQuota} interviews for this phase.
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 sm:h-4">
          <div
            className="bg-primary-DEFAULT h-2.5 sm:h-4 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          ></div>
        </div>
        <p className="text-right text-xs sm:text-sm font-medium text-gray-900 mt-1">
          {interviews.length} / {interviewQuota} interviews logged ({progress.toFixed(0)}%)
        </p>
      </Card>

      {interviews.length === 0 ? (
        <Card>
          <p className="text-center text-gray-800 py-8">
            No interviews logged yet. Click "Log New Interview" to get started.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((interview) => (
            <Card key={interview.id} title={`Interview: ${new Date(interview.date).toLocaleDateString()}`}
              actions={
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => openModalForEdit(interview.id)}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => confirm('Are you sure you want to delete this interview?') && deleteInterview(interview.id)}>Delete</Button>
                </div>
              }
            >
              <div className="space-y-3">
                {interview.intervieweeName && <p className="text-sm text-gray-800"><strong className="text-gray-800">Interviewee:</strong> {interview.intervieweeName}</p>}
                {interview.customerSegment && <p className="text-sm text-gray-800"><strong className="text-gray-800">Segment:</strong> {interview.customerSegment}</p>}
                <div>
                  <strong className="text-sm text-gray-800">Key Takeaways:</strong>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap max-h-28 overflow-y-auto bg-gray-50 p-2 rounded-md">
                    {interview.keyTakeaways}
                  </p>
                </div>
                {interview.tags.length > 0 && (
                  <div className="text-sm">
                    <strong className="text-gray-800">Tags:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {interview.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-accent-DEFAULT/20 text-accent-DEFAULT text-xs rounded-full">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
                {interview.sentiment && <p className="text-sm capitalize text-gray-800"><strong className="text-gray-800">Sentiment:</strong> {interview.sentiment}</p>}
                
                {apiKeyStatus === 'ok' && (
                    <Button 
                        size="sm" 
                        variant="secondary" 
                        isAiFeature 
                        onClick={() => handleGenerateSummary(interview.id)}
                        isLoading={summarizingId === interview.id}
                        disabled={summarizingId === interview.id || !interview.keyTakeaways?.trim()}
                    >
                        {interview.aiSummary && summarizingId !== interview.id ? 'Regenerate' : 'AI Summary'}
                    </Button>
                )}
                {interview.aiSummary && summarizingId !== interview.id && (
                    <div className="mt-2 p-2 bg-indigo-50 rounded-md border border-indigo-100">
                        <p className="text-xs font-semibold text-indigo-700">AI Summary:</p>
                        <p className="text-xs text-indigo-600 whitespace-pre-wrap max-h-20 overflow-y-auto">{interview.aiSummary}</p>
                    </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {isModalOpen && (
        <InterviewForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          interviewToEdit={interviewToEdit}
        />
      )}
    </div>
  );
};

export default CustomerInsightsPage;
