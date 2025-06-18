
import React, { useEffect, useState, useCallback } from 'react';
import { BusinessModelCanvasData, BusinessModelBlockType, BusinessModelBlockData } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';
import TextArea from '../ui/TextArea';
import Card from '../ui/Card';
import Input from '../ui/Input';

const blockTitles: Record<BusinessModelBlockType, string> = {
  keyPartners: 'Key Partners',
  keyActivities: 'Key Activities',
  keyResources: 'Key Resources',
  valuePropositions: 'Value Propositions',
  customerRelationships: 'Customer Relationships',
  channels: 'Channels',
  customerSegments: 'Customer Segments',
  costStructure: 'Cost Structure',
  revenueStreams: 'Revenue Streams',
};

const blockPlaceholders: Record<BusinessModelBlockType, string> = {
    keyPartners: "Who are our key partners? Suppliers? Who do we need to rely on?",
    keyActivities: "What key activities do our value propositions require? Our distribution channels? Customer relationships?",
    keyResources: "What key resources do our value propositions require? (Physical, intellectual, human, financial)",
    valuePropositions: "What value do we deliver to the customer? Which customer needs are we satisfying? (This should align with your Value Proposition Canvas)",
    customerRelationships: "What type of relationship does each customer segment expect? (e.g., personal assistance, self-service, automated)",
    channels: "Through which channels do our customer segments want to be reached? How are we reaching them now?",
    customerSegments: "For whom are we creating value? Who are our most important customers?",
    costStructure: "What are the most important costs inherent in our business model? Which key resources/activities are most expensive?",
    revenueStreams: "For what value are our customers willing to pay? How do they currently pay? How would they prefer to pay? (e.g., asset sale, usage fee, subscription)"
};

const financialBlockTypes: BusinessModelBlockType[] = ['costStructure', 'revenueStreams'];

const getDefaultBMC = (): BusinessModelCanvasData => ({
  id: 'default-bmc',
  blocks: {
    keyPartners: { content: '', financialHypotheses: '' },
    keyActivities: { content: '', financialHypotheses: '' },
    keyResources: { content: '', financialHypotheses: '' },
    valuePropositions: { content: '', financialHypotheses: '' },
    customerRelationships: { content: '', financialHypotheses: '' },
    channels: { content: '', financialHypotheses: '' },
    customerSegments: { content: '', financialHypotheses: '' },
    costStructure: { content: '', financialHypotheses: '' },
    revenueStreams: { content: '', financialHypotheses: '' },
  }
});


const BusinessModelCanvasEditor: React.FC = () => {
  const { businessModel, updateBusinessModelBlock, valueProposition } = useAppContext();
  
  const getInitialCanvasData = useCallback((): BusinessModelCanvasData => {
    let initialBMC = businessModel || getDefaultBMC();
    if (valueProposition && 
        (!initialBMC.blocks.valuePropositions.content || initialBMC.blocks.valuePropositions.content.startsWith("Linked from VP Canvas:"))) {
      const vpSummary = `Products/Services: ${valueProposition.productsServices || 'N/A'}\nPain Relievers: ${valueProposition.painRelievers || 'N/A'}\nGain Creators: ${valueProposition.gainCreators || 'N/A'}`;
      initialBMC = {
        ...initialBMC,
        blocks: {
          ...initialBMC.blocks,
          valuePropositions: { ...(initialBMC.blocks.valuePropositions || {}), content: `Linked from VP Canvas:\n${vpSummary}` }
        }
      };
    }
    return initialBMC;
  }, [businessModel, valueProposition]);

  const [canvasData, setCanvasData] = useState<BusinessModelCanvasData>(getInitialCanvasData());

  useEffect(() => {
    const contextBMC = getInitialCanvasData();
    setCanvasData(prevLocalData => {
      const newBlocks = { ...contextBMC.blocks };

      (Object.keys(newBlocks) as BusinessModelBlockType[]).forEach(blockType => {
        const currentBlock = prevLocalData.blocks[blockType];
        const contextBlock = contextBMC.blocks[blockType];
        
        const contentInputName = `${blockType}-content`;
        const financialInputName = `${blockType}-financialHypotheses`;

        let newContent = contextBlock.content;
        if (document.activeElement?.getAttribute('name') === contentInputName) {
          newContent = currentBlock.content;
        }

        let newFinancialHypotheses = contextBlock.financialHypotheses;
        if (financialBlockTypes.includes(blockType) && document.activeElement?.getAttribute('name') === financialInputName) {
          newFinancialHypotheses = currentBlock.financialHypotheses;
        }
        
        newBlocks[blockType] = { 
          content: newContent, 
          financialHypotheses: newFinancialHypotheses 
        };
      });
      return { ...contextBMC, blocks: newBlocks };
    });
  }, [businessModel, valueProposition, getInitialCanvasData]);


  const handleChange = (blockType: BusinessModelBlockType, field: keyof BusinessModelBlockData, value: string) => {
    setCanvasData(prev => {
      if (!prev) return getDefaultBMC(); 
      const updatedBlock = { ...(prev.blocks[blockType] || {}), [field]: value };
      return { ...prev, blocks: { ...prev.blocks, [blockType]: updatedBlock } };
    });
  };

  const debouncedUpdateAppContext = useCallback(
    (dataToUpdate: BusinessModelCanvasData) => {
      const timer = setTimeout(() => {
        (Object.keys(dataToUpdate.blocks) as BusinessModelBlockType[]).forEach(blockType => {
           if (businessModel && JSON.stringify(dataToUpdate.blocks[blockType]) !== JSON.stringify(businessModel.blocks[blockType])) {
            updateBusinessModelBlock(blockType, dataToUpdate.blocks[blockType]);
          } else if (!businessModel) { 
            updateBusinessModelBlock(blockType, dataToUpdate.blocks[blockType]);
          }
        });
      }, 700);
      return () => clearTimeout(timer);
    },
    [updateBusinessModelBlock, businessModel]
  );
  
  useEffect(() => {
    if (JSON.stringify(canvasData) !== JSON.stringify(businessModel || getInitialCanvasData())) {
        debouncedUpdateAppContext(canvasData);
    }
  }, [canvasData, debouncedUpdateAppContext, businessModel, getInitialCanvasData]);


  if (!canvasData) {
    return <Card><p>Loading Business Model Canvas...</p></Card>;
  }

  const renderBlock = (blockType: BusinessModelBlockType) => {
    const blockData = canvasData.blocks[blockType] || { content: '', financialHypotheses: '' };
    const isFinancialBlock = financialBlockTypes.includes(blockType);
    const isVpBlock = blockType === 'valuePropositions';

    let rows = isVpBlock ? 6 : 4; // Default rows for md+
    if (typeof window !== 'undefined' && window.innerWidth < 768) { // md breakpoint
        rows = isVpBlock ? 5 : 3; // Fewer rows for mobile
    }


    return (
      <Card key={blockType} title={blockTitles[blockType]} className="h-full flex flex-col" titleClassName="py-3 px-3 sm:px-4" bodyClassName="p-3 sm:p-4">
        <div className="flex-grow">
        <TextArea
          name={`${blockType}-content`}
          value={blockData.content}
          onChange={(e) => handleChange(blockType, 'content', e.target.value)}
          placeholder={blockPlaceholders[blockType]}
          rows={rows}
          className="text-xs sm:text-sm text-gray-800"
          readOnly={isVpBlock && blockData.content.startsWith("Linked from VP Canvas:")}
        />
        {isVpBlock && blockData.content.startsWith("Linked from VP Canvas:") && (
            <p className="text-xs text-gray-500 mt-1">This content is auto-populated from the Value Proposition module. Edit there to update.</p>
        )}
        </div>
        {isFinancialBlock && (
          <div className="mt-auto pt-2 sm:pt-3">
            <Input
              label="Financial Hypotheses"
              name={`${blockType}-financialHypotheses`}
              value={blockData.financialHypotheses || ''}
              onChange={(e) => handleChange(blockType, 'financialHypotheses', e.target.value)}
              placeholder={blockType === 'costStructure' ? "e.g., CAC, server costs" : "e.g., Price, LTV"}
              className="text-xs sm:text-sm text-gray-800"
            />
          </div>
        )}
      </Card>
    );
  };
  
  return (
    <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-10 gap-3 sm:gap-4">
            <div className="md:col-span-2">{renderBlock('keyPartners')}</div>
            <div className="md:col-span-2">
                {renderBlock('keyActivities')}
                <div className="mt-3 sm:mt-4">{renderBlock('keyResources')}</div>
            </div>
            <div className="md:col-span-2">
                {renderBlock('valuePropositions')}
                 <div className="mt-3 sm:mt-4">{renderBlock('channels')}</div> {/* This might become channels & customer relationships */}
            </div>
             <div className="md:col-span-2">{renderBlock('customerRelationships')}</div>
            <div className="md:col-span-2">{renderBlock('customerSegments')}</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {renderBlock('costStructure')}
            {renderBlock('revenueStreams')}
        </div>
    </div>
  );
};

export default BusinessModelCanvasEditor;
