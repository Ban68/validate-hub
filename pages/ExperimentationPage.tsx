
import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAppContext } from '../hooks/useAppContext';
import { Hypothesis, TestCard, MVP } from '../types';
import HypothesisForm from '../components/experimentation/HypothesisForm';
import TestCardForm from '../components/experimentation/TestCardForm';
import MvpForm from '../components/experimentation/MvpForm';
import { BeakerIcon, LightBulbIcon, DocumentTextIcon, CheckCircleIcon, XCircleIcon, ClockIcon, SparklesIcon } from '../constants';

// ExperimentationPage: Manages hypotheses, test cards, and MVPs.
const ExperimentationPage: React.FC = () => {
  const { 
    hypotheses, deleteHypothesis, getHypothesisById, critiqueHypothesis,
    testCards, deleteTestCard, getTestCardById,
    mvps, deleteMvp, getMvpById, apiKeyStatus
  } = useAppContext();

  const [isHypothesisModalOpen, setIsHypothesisModalOpen] = useState(false);
  const [hypothesisToEdit, setHypothesisToEdit] = useState<Hypothesis | null>(null);
  const [critiquingId, setCritiquingId] = useState<string | null>(null);


  const [isTestCardModalOpen, setIsTestCardModalOpen] = useState(false);
  const [testCardToEdit, setTestCardToEdit] = useState<TestCard | null>(null);
  const [defaultHypothesisIdForTestCard, setDefaultHypothesisIdForTestCard] = useState<string | undefined>(undefined);


  const [isMvpModalOpen, setIsMvpModalOpen] = useState(false);
  const [mvpToEdit, setMvpToEdit] = useState<MVP | null>(null);

  // Hypothesis Handlers
  const openHypothesisModalForNew = () => { setHypothesisToEdit(null); setIsHypothesisModalOpen(true); };
  const openHypothesisModalForEdit = (id: string) => { setHypothesisToEdit(getHypothesisById(id) || null); setIsHypothesisModalOpen(true); };
  const handleCritiqueHypothesis = async (id: string) => {
    if(apiKeyStatus === 'missing') { alert("API Key not configured."); return; }
    setCritiquingId(id);
    await critiqueHypothesis(id);
    setCritiquingId(null);
  }

  // Test Card Handlers
  const openTestCardModalForNew = (hypothesisId?: string) => { 
    setTestCardToEdit(null); 
    setDefaultHypothesisIdForTestCard(hypothesisId);
    setIsTestCardModalOpen(true); 
  };
  const openTestCardModalForEdit = (id: string) => { setTestCardToEdit(getTestCardById(id) || null); setIsTestCardModalOpen(true); };

  // MVP Handlers
  const openMvpModalForNew = () => { setMvpToEdit(null); setIsMvpModalOpen(true); };
  const openMvpModalForEdit = (id: string) => { setMvpToEdit(getMvpById(id) || null); setIsMvpModalOpen(true); };
  
  const getStatusIcon = (status: Hypothesis['status'] | TestCard['status'] | MVP['status']) => {
    switch(status) {
        case 'pending':
        case 'planned':
        case 'ideation':
            return <ClockIcon className="h-5 w-5 text-yellow-500 mr-1 shrink-0" aria-label={status}/>;
        case 'testing':
        case 'running':
        case 'building':
            return <BeakerIcon className="h-5 w-5 text-blue-500 mr-1 shrink-0" aria-label={status}/>;
        case 'validated':
        case 'completed':
            return <CheckCircleIcon className="h-5 w-5 text-green-500 mr-1 shrink-0" aria-label={status}/>;
        case 'invalidated':
            return <XCircleIcon className="h-5 w-5 text-red-500 mr-1 shrink-0" aria-label={status}/>;
        default:
            return null;
    }
  };


  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Experimentation Hub</h1>
        <p className="mt-1 text-sm sm:text-base text-gray-700">
          Design, run, and track experiments to validate your hypotheses and MVPs.
        </p>
      </header>

      {/* Hypotheses Section */}
      <section>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 space-y-3 sm:space-y-0">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Hypotheses</h2>
          <Button onClick={openHypothesisModalForNew} leftIcon={<LightBulbIcon className="h-5 w-5 mr-1 sm:mr-2"/>} className="w-full sm:w-auto">New Hypothesis</Button>
        </div>
        {hypotheses.length === 0 ? <Card><p className="text-center text-gray-800 py-4">No hypotheses defined yet.</p></Card> : (
          <div className="space-y-4">
            {hypotheses.map(h => (
              <Card key={h.id} title={
                <div className="flex items-center">
                    {getStatusIcon(h.status)} <span className="text-neutral-dark truncate" title={h.description}>Hypothesis</span> 
                </div>} 
                actions={
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => openHypothesisModalForEdit(h.id)}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => confirm('Delete hypothesis?') && deleteHypothesis(h.id)}>Delete</Button>
                </div>
              }>
                <p className="text-sm sm:text-base text-gray-800 whitespace-pre-wrap">{h.description}</p>
                <p className="text-xs text-gray-500 mt-1">Created: {new Date(h.createdAt).toLocaleDateString()}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                    <Button size="sm" variant="secondary" onClick={() => openTestCardModalForNew(h.id)}>+ New Test Card</Button>
                    {apiKeyStatus === 'ok' && (
                        <Button 
                            size="sm" 
                            variant="ghost" 
                            isAiFeature 
                            onClick={() => handleCritiqueHypothesis(h.id)}
                            isLoading={critiquingId === h.id}
                            disabled={critiquingId === h.id}
                        >
                            {h.aiCritique && critiquingId !== h.id ? 'Regenerate' : ''} AI Critique
                        </Button>
                    )}
                </div>
                {h.aiCritique && critiquingId !== h.id && (
                     <div className="mt-2 p-2 bg-indigo-50 rounded-md border border-indigo-100">
                        <p className="text-xs font-semibold text-indigo-700">AI Critique:</p>
                        <p className="text-xs text-indigo-600 whitespace-pre-wrap">{h.aiCritique}</p>
                    </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Test Cards Section */}
      <section>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 space-y-3 sm:space-y-0">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Test Cards</h2>
          <Button onClick={() => openTestCardModalForNew()} leftIcon={<DocumentTextIcon className="h-5 w-5 mr-1 sm:mr-2"/>} className="w-full sm:w-auto">New Test Card</Button>
        </div>
        {testCards.length === 0 ? <Card><p className="text-center text-gray-800 py-4">No test cards created yet.</p></Card> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testCards.map(tc => {
                const linkedHypo = getHypothesisById(tc.hypothesisId);
                return (
                    <Card key={tc.id} title={
                        <div className="flex items-center">
                            {getStatusIcon(tc.status)} <span className="text-neutral-dark truncate" title={tc.testDescription}>Test Card</span>
                        </div>
                    } actions={
                        <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" onClick={() => openTestCardModalForEdit(tc.id)}>Edit</Button>
                        <Button size="sm" variant="danger" onClick={() => confirm('Delete test card?') && deleteTestCard(tc.id)}>Delete</Button>
                        </div>
                    }>
                        <p className="text-sm text-gray-800"><strong className="text-neutral-dark">Testing Hypothesis:</strong> {linkedHypo?.description.substring(0,70) || tc.hypothesisId}{linkedHypo && linkedHypo.description.length > 70 ? '...' : ''}</p>
                        <p className="text-sm text-gray-800 mt-1"><strong className="text-neutral-dark">Test:</strong> {tc.testDescription}</p>
                        <p className="text-sm text-gray-800 mt-1"><strong className="text-neutral-dark">Metric:</strong> {tc.metric}</p>
                        <p className="text-sm text-gray-800 mt-1"><strong className="text-neutral-dark">Success Criteria:</strong> {tc.successCriteria}</p>
                        {tc.status === 'completed' && tc.results && <p className="text-sm text-gray-800 mt-1"><strong className="text-neutral-dark">Results:</strong> {tc.results}</p>}
                        {tc.status === 'completed' && tc.learnings && <p className="text-sm text-gray-800 mt-1"><strong className="text-neutral-dark">Learnings:</strong> {tc.learnings}</p>}
                    </Card>
                );
            })}
          </div>
        )}
      </section>

      {/* MVPs Section */}
      <section>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 space-y-3 sm:space-y-0">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Minimum Viable Products (MVPs)</h2>
          <Button onClick={openMvpModalForNew} leftIcon={<BeakerIcon className="h-5 w-5 mr-1 sm:mr-2"/>} className="w-full sm:w-auto">New MVP</Button>
        </div>
        {mvps.length === 0 ? <Card><p className="text-center text-gray-800 py-4">No MVPs defined yet.</p></Card> : (
          <div className="space-y-4">
            {mvps.map(mvp => (
              <Card key={mvp.id} title={
                <div className="flex items-center">
                    {getStatusIcon(mvp.status)} <span className="text-neutral-dark truncate" title={mvp.name}>MVP: {mvp.name}</span>
                </div>
              } actions={
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => openMvpModalForEdit(mvp.id)}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => confirm('Delete MVP?') && deleteMvp(mvp.id)}>Delete</Button>
                </div>
              }>
                <p className="text-sm text-gray-800"><strong className="text-neutral-dark">Type:</strong> {mvp.type}</p>
                <p className="text-sm text-gray-800 mt-1"><strong className="text-neutral-dark">Description:</strong> {mvp.description}</p>
                <p className="text-sm text-gray-800 mt-1"><strong className="text-neutral-dark">Metrics:</strong> {mvp.metricsToTrack}</p>
                {mvp.linkedHypothesisIds.length > 0 && 
                  <p className="text-sm text-gray-800 mt-1">
                    <strong className="text-neutral-dark">Tests Hypotheses:</strong> {mvp.linkedHypothesisIds.map(hid => getHypothesisById(hid)?.description.substring(0,30)+"...").join(', ') || 'None linked'}
                  </p>
                }
              </Card>
            ))}
          </div>
        )}
      </section>

      {isHypothesisModalOpen && <HypothesisForm isOpen={isHypothesisModalOpen} onClose={() => setIsHypothesisModalOpen(false)} hypothesisToEdit={hypothesisToEdit} />}
      {isTestCardModalOpen && <TestCardForm isOpen={isTestCardModalOpen} onClose={() => setIsTestCardModalOpen(false)} testCardToEdit={testCardToEdit} defaultHypothesisId={defaultHypothesisIdForTestCard} />}
      {isMvpModalOpen && <MvpForm isOpen={isMvpModalOpen} onClose={() => setIsMvpModalOpen(false)} mvpToEdit={mvpToEdit} />}
    </div>
  );
};

export default ExperimentationPage;
