
import React from 'react';

interface AccessInfo {
  firstName: string;
  lastName: string;
  companyName: string;
  accessedAt: string;
}

interface InterventionAccessInfoProps {
  accessInfo: AccessInfo;
}

export const InterventionAccessInfo: React.FC<InterventionAccessInfoProps> = ({ 
  accessInfo 
}) => {
  return (
    <div>
      <h2 className="text-lg font-semibold">Informations d'accès</h2>
      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3 bg-gray-50 rounded">
          <p className="text-sm text-gray-500">Nom complet</p>
          <p className="font-medium">{accessInfo?.firstName} {accessInfo?.lastName}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded">
          <p className="text-sm text-gray-500">Entreprise</p>
          <p className="font-medium">{accessInfo?.companyName}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded">
          <p className="text-sm text-gray-500">Date d'accès</p>
          <p className="font-medium">{accessInfo?.accessedAt && new Date(accessInfo.accessedAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};
