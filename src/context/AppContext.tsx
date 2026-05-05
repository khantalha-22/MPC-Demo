import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type Phase = 'WEB' | 'SPLIT';
type WebView = 'DASHBOARD' | 'USER_MANAGEMENT' | 'WALLET_PERMISSIONS';
type MobileView = 'M1' | 'M2' | 'M3' | 'M4' | 'M5' | 'M6' | 'M7';
type DemoOption = 'option1' | 'option2' | null;
type AttestationFlowType = 'invite' | 'wallet';

interface Admin {
  id: string;
  name: string;
  email: string;
  roles: string[];
  walletPerms: {
    erc20: boolean;
    erc20Amount: string;
    erc721: boolean;
    erc721Tokens: string[];
    burnVdt: boolean;
    burnVdtTokens: string[];
    signing: boolean;
  };
  status: 'Active' | 'Pending';
  dateAdded: string;
}

interface AppContextType {
  phase: Phase;
  setPhase: (phase: Phase) => void;
  webView: WebView;
  setWebView: (view: WebView) => void;
  isInviteModalOpen: boolean;
  setIsInviteModalOpen: (isOpen: boolean) => void;
  mobileView: MobileView;
  setMobileView: (view: MobileView) => void;
  hasNewUser: boolean;
  setHasNewUser: (has: boolean) => void;
  demoOption: DemoOption;
  setDemoOption: (option: DemoOption) => void;
  attestationFlowType: AttestationFlowType;
  setAttestationFlowType: (type: AttestationFlowType) => void;
  inviteFlowCompleted: boolean;
  setInviteFlowCompleted: (completed: boolean) => void;
  selectedRoles: string[];
  setSelectedRoles: (roles: string[]) => void;
  // Wallet Permission Details
  walletPerms: {
    erc20: boolean;
    erc20Amount: string;
    erc721: boolean;
    erc721Tokens: string[];
    burnVdt: boolean;
    burnVdtTokens: string[];
    signing: boolean;
  };
  setWalletPerms: (perms: any) => void;
  admins: Admin[];
  addAdmin: (admin: Omit<Admin, 'id' | 'status' | 'dateAdded'>) => void;
  currentAdmin: Admin | null;
  resetDemo: () => void;
  finishMobileFlow: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [phase, setPhase] = useState<Phase>('WEB');
  const [webView, setWebView] = useState<WebView>('DASHBOARD');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [mobileView, setMobileView] = useState<MobileView>('M1');
  const [hasNewUser, setHasNewUser] = useState(false);
  const [demoOption, setDemoOption] = useState<DemoOption>(null);
  const [attestationFlowType, setAttestationFlowType] = useState<AttestationFlowType>('invite');
  const [inviteFlowCompleted, setInviteFlowCompleted] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [walletPerms, setWalletPerms] = useState({
    erc20: false,
    erc20Amount: '',
    erc721: false,
    erc721Tokens: [],
    burnVdt: false,
    burnVdtTokens: [],
    signing: false
  });

  const initialAdmins: Admin[] = [
    {
      id: '1',
      name: 'Jane Doe',
      email: 'jane.doe@exp.com',
      roles: ['pactvera_admin', 'product_transfers'],
      walletPerms: {
        erc20: true,
        erc20Amount: '5000',
        erc721: true,
        erc721Tokens: ['Product VDT'],
        burnVdt: false,
        burnVdtTokens: [],
        signing: true
      },
      status: 'Active',
      dateAdded: '2026-04-15'
    },
    {
      id: '2',
      name: 'Mark Howard',
      email: 'mark.h@exp.com',
      roles: ['pactvera_admin', 'tca_releasers'],
      walletPerms: {
        erc20: false,
        erc20Amount: '',
        erc721: false,
        erc721Tokens: [],
        burnVdt: true,
        burnVdtTokens: ['Device VDT'],
        signing: false
      },
      status: 'Active',
      dateAdded: '2026-04-20'
    }
  ];

  const [admins, setAdmins] = useState<Admin[]>(initialAdmins);
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);

  const addAdmin = (newAdmin: Omit<Admin, 'id' | 'status' | 'dateAdded'>) => {
    const admin: Admin = {
      ...newAdmin,
      id: Math.random().toString(36).substr(2, 9),
      status: 'Pending',
      dateAdded: new Date().toISOString().split('T')[0]
    };
    setAdmins(prev => [...prev, admin]);
    setCurrentAdmin(admin);
  };

  const resetDemo = () => {
    setPhase('WEB');
    setWebView('DASHBOARD');
    setIsInviteModalOpen(false);
    setMobileView('M1');
    setHasNewUser(false);
    setDemoOption(null);
    setAttestationFlowType('invite');
    setInviteFlowCompleted(false);
    setSelectedRoles([]);
    setWalletPerms({
      erc20: false,
      erc20Amount: '',
      erc721: false,
      erc721Tokens: [],
      burnVdt: false,
      burnVdtTokens: [],
      signing: false
    });
    setAdmins(initialAdmins);
    setCurrentAdmin(null);
  };

  const finishMobileFlow = () => {
    if (demoOption === 'option2' && attestationFlowType === 'invite') {
      setPhase('WEB');
      setWebView('DASHBOARD');
      setMobileView('M1');
      setInviteFlowCompleted(true);
    } else {
      resetDemo();
    }
  };

  return (
    <AppContext.Provider
      value={{
        phase,
        setPhase,
        webView,
        setWebView,
        isInviteModalOpen,
        setIsInviteModalOpen,
        mobileView,
        setMobileView,
        hasNewUser,
        setHasNewUser,
        demoOption,
        setDemoOption,
        attestationFlowType,
        setAttestationFlowType,
        inviteFlowCompleted,
        setInviteFlowCompleted,
        selectedRoles,
        setSelectedRoles,
        walletPerms,
        setWalletPerms,
        admins,
        addAdmin,
        currentAdmin,
        resetDemo,
        finishMobileFlow
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
