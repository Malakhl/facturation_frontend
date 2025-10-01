import { useState } from "react";
import { InvoiceCard } from "@/components/InvoiceCard";
import { ProcessModal } from "@/components/ProcessModal";
import dfdsIcon from "@/assets/dfds-icon.jpg";
import amlIcon from "@/assets/aml-icon.jpg";
import agenceIcon from "@/assets/agence-icon.jpg";

const Index = () => {
  const [selectedInvoiceType, setSelectedInvoiceType] = useState<{
    title: string;
    variant: "primary" | "success" | "warning";
  } | null>(null);

  const invoiceTypes = [
    {
      title: "DFDS",
      description: "Factures de transport maritime DFDS Seaways pour vos expéditions internationales",
      icon: dfdsIcon,
      variant: "primary" as const,
    },
    {
      title: "AML",
      description: "Documents Anti-Money Laundering pour la conformité réglementaire financière",
      icon: amlIcon,
      variant: "success" as const,
    },
    {
  title: "Siège",
  description: "Factures du siège et prestations de services administratifs",
  icon: agenceIcon,
  variant: "warning" as const,
    },
  ];

  const handleCardClick = (invoiceType: typeof invoiceTypes[0]) => {
    setSelectedInvoiceType({
      title: invoiceType.title,
      variant: invoiceType.variant,
    });
  };

  const handleCloseModal = () => {
    setSelectedInvoiceType(null);
  };

  return (
    <>
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-success/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-primary rounded-full blur-3xl opacity-10 -translate-y-48 translate-x-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-success rounded-full blur-3xl opacity-10 translate-y-48 -translate-x-48" />

        <div className="relative z-10">
          {/* Header */}
          <header className="px-6 py-8">
            <div className="max-w-6xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center space-x-2 bg-card/50 backdrop-blur-sm border border-border/20 rounded-full px-4 py-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span>Système de traitement automatisé</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-foreground via-primary to-success bg-clip-text text-transparent">
                PDF to Excel
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Convertissez automatiquement vos factures PDF en données Excel structurées. 
                Sélectionnez votre type de facture pour commencer.
              </p>
            </div>
          </header>

          {/* Main content */}
          <main className="px-6 pb-12">
            <div className="max-w-6xl mx-auto">
              {/* Invoice type selection */}
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {invoiceTypes.map((type) => (
                  <InvoiceCard
                    key={type.title}
                    title={type.title}
                    description={type.description}
                    icon={type.icon}
                    variant={type.variant}
                    onClick={() => handleCardClick(type)}
                  />
                ))}
              </div>

              {/* Features section */}
              <div className="grid md:grid-cols-2 gap-8 mt-16">
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-foreground">
                    Processus automatisé
                  </h2>
                  <div className="space-y-4">
                    {/* <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center mt-1">
                        <span className="text-white text-sm font-bold">1</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Upload votre fichier Excel</h3>
                        <p className="text-muted-foreground text-sm">
                          Sélectionnez le fichier Excel de base qui servira de modèle
                        </p>
                      </div>
                    </div> */}
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gradient-success rounded-full flex items-center justify-center mt-1">
                        <span className="text-white text-sm font-bold">1</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Ajoutez vos PDFs</h3>
                        <p className="text-muted-foreground text-sm">
                          Uploadez vos factures PDF 
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gradient-warning rounded-full flex items-center justify-center mt-1">
                        <span className="text-white text-sm font-bold">2</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Téléchargez le résultat</h3>
                        <p className="text-muted-foreground text-sm">
                          Obtenez votre fichier Excel enrichi avec les données extraites
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-foreground">
                    Formats supportés
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-card/50 backdrop-blur-sm border border-border/20 rounded-lg p-4 text-center">
                      <div className="w-12 h-12 bg-gradient-primary rounded-lg mx-auto mb-3 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 18h12V6h-4V2H4v16zm-2 1V1a1 1 0 011-1h8.414a1 1 0 01.707.293l3.586 3.586A1 1 0 0116 4.414V19a1 1 0 01-1 1H3a1 1 0 01-1-1z"/>
                        </svg>
                      </div>
                      <h3 className="font-semibold text-sm">PDF</h3>
                      <p className="text-xs text-muted-foreground">Factures numériques</p>
                    </div>
                    <div className="bg-card/50 backdrop-blur-sm border border-border/20 rounded-lg p-4 text-center">
                      <div className="w-12 h-12 bg-gradient-success rounded-lg mx-auto mb-3 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 18h12V6h-4V2H4v16zm-2 1V1a1 1 0 011-1h8.414a1 1 0 01.707.293l3.586 3.586A1 1 0 0116 4.414V19a1 1 0 01-1 1H3a1 1 0 01-1-1z"/>
                        </svg>
                      </div>
                      <h3 className="font-semibold text-sm">Excel</h3>
                      <p className="text-xs text-muted-foreground">XLSX, XLS</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Process Modal */}
      {selectedInvoiceType && (
        <ProcessModal
          isOpen={!!selectedInvoiceType}
          onClose={handleCloseModal}
          invoiceType={selectedInvoiceType}
        />
      )}
    </>
  );
};

export default Index;