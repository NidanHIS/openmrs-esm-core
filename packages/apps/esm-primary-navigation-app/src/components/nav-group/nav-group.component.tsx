import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Accordion, AccordionItem } from '@carbon/react';
import { ComponentContext, ExtensionSlot, useConfig, Type } from '@openmrs/esm-framework/src/internal';

export const navGroupFeatureName = 'Nav Group';

export const navGroupConfigSchema = {
  title: {
    _type: Type.String,
    _description: 'The title of the nav group.',
    _default: 'My Group',
  },
  slotName: {
    _type: Type.String,
    _description: 'The name of the slot to create, which links can be added to.',
    _default: '',
  },
  isExpanded: {
    _type: Type.Boolean,
    _description: 'The boolean to determine whether the nav group is expanded or not by default.',
    _default: true, // Changed default to true
  },
};

export interface NavGroupConfig {
  title: string;
  slotName: string;
  isExpanded?: boolean;
}

interface NavGroupProps {
  basePath?: string;
}

export function NavGroup({ basePath }: NavGroupProps) {
  const componentContext = useContext(ComponentContext);
  const { t } = useTranslation();
  const { title, isExpanded: defaultExpanded, slotName } = useConfig<NavGroupConfig>();
  
  // Use local state to control expansion, defaulting to config value
  const [isExpanded, setIsExpanded] = useState(defaultExpanded ?? true);

  return (
    <Accordion>
      <AccordionItem 
        open={isExpanded} 
        title={t(title)}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <ExtensionSlot
          name={slotName ?? `nav-group-${title}`}
          state={{ basePath, moduleName: componentContext.extension?.extensionSlotModuleName }}
        />
      </AccordionItem>
    </Accordion>
  );
}
