import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import axios from "axios";
import { Upload, Link, FileSpreadsheet, Download, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


interface ProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceType: {
    title: string;
    variant: "primary" | "success" | "warning";
  };
}

export function ProcessModal({ isOpen, onClose, invoiceType }: ProcessModalProps) {
  const [step, setStep] = useState(1);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [pdfCount, setPdfCount] = useState<string>("");
  const [pdfInputs, setPdfInputs] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();
  const [excelData, setExcelData] = useState<any[]>([]); // données actuelles du fichier
  const [files, setFiles] = useState<File[]>([]);
  
  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setExcelFile(file);

  const reader = new FileReader();
  reader.onload = (evt) => {
    const data = evt.target?.result;
    if (!data) return;

    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData: any[] = XLSX.utils.sheet_to_json(sheet);
    setExcelData(jsonData); // sauvegarder les données existantes
  };
  reader.readAsArrayBuffer(file);
};
  
  // 📝 Ajouter les données API au fichier Excel
const appendApiDataToExcel = (apiData: any[]) => {
  const newData = [...excelData, ...apiData]; // concaténer sans supprimer les anciennes lignes
  setExcelData(newData);
};
  const handlePdfCountChange = (value: string) => {
    setPdfCount(value);
    const count = parseInt(value);
    setPdfInputs(Array(count).fill(""));
  };

  const handlePdfInputChange = (index: number, value: string) => {
    const newInputs = [...pdfInputs];
    newInputs[index] = value;
    setPdfInputs(newInputs);
  };

  // const handleProcess = async () => {
  //   setIsProcessing(true);
    
  //   // Simulation de l'API
  //   await new Promise(resolve => setTimeout(resolve, 3000));
    
  //   setIsProcessing(false);
  //   setIsComplete(true);
    
  //   toast({
  //     title: "Traitement terminé",
  //     description: "Vos factures ont été traitées avec succès!",
  //   });
  // };
 const transfere_agence = async () => {
  if (files.length === 0) {
    alert("Veuillez ajouter au moins un PDF !");
    return;
  }

  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file); // clé "files" correspond à request.files.getlist('files') côté Flask
  });

  try {
    setIsProcessing(true);

    const response = await axios.post("http://127.0.0.1:8088/transfer_agence", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.status === "success") {
     
      console.log(response.data.data); // tableau avec toutes les lignes extraites
              setIsProcessing(true);
               appendApiDataToExcel(response.data.data);
          // Simulation de l'API
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          setIsProcessing(false);
          setIsComplete(true);
          
          toast({
            title: "Traitement terminé",
            description: "Vos factures ont été traitées avec succès!",
          }); 
          alert(`✅ ${response.data.rows} factures traitées avec succès !`);
    } else {
      alert(`❌ Erreur : ${response.data.message}`);
    }
  } catch (error: any) {
    console.error("Erreur API :", error.response || error.message);
    alert("❌ Erreur lors de l'envoi des fichiers PDF");
  } finally {
    setIsProcessing(false);
  }
};




//  const transfer_dfds = async () => {
//   if (files.length === 0) {
//     alert("Veuillez ajouter au moins un PDF !");
//     return;
//   }

//   const formData = new FormData();
//   files.forEach((file) => {
//     formData.append("files", file); // clé "files" correspond à request.files.getlist('files') côté Flask
//   });
// // https://malakhouali05.pythonanywhere.com
//   try {
//     setIsProcessing(true);

//     const response = await axios.post("http://127.0.0.1:8088/transfer_dfds", formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });

//     if (response.data.status === "success") {
     
//       console.log(response.data.data); // tableau avec toutes les lignes extraites
//               setIsProcessing(true);
//                appendApiDataToExcel(response.data.data);
//           // Simulation de l'API
//           await new Promise(resolve => setTimeout(resolve, 3000));
          
//           setIsProcessing(false);
//           setIsComplete(true);
          
//           toast({
//             title: "Traitement terminé",
//             description: "Vos factures ont été traitées avec succès!",
//           }); 
//           alert(`✅ ${response.data.rows} factures traitées avec succès !`);
//     } else {
//       alert(`❌ Erreur : ${response.data.message}`);
//     }
//   } catch (error: any) {
//     console.error("Erreur API :", error.response || error.message);
//     alert("❌ Erreur lors de l'envoi des fichiers PDF");
//   } finally {
//     setIsProcessing(false);
//   }
// };
const transfer_dfds = async () => {
  if (files.length === 0) {
    alert("Veuillez ajouter au moins un PDF !");
    return;
  }

  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  try {
    setIsProcessing(true);

    const response = await axios.post("http://127.0.0.1:8088/transfer_dfds", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.status === "success") {
      console.log("Données reçues:", response.data.data);
      
      // Extraire toutes les factures de tous les fichiers
      const allInvoices = [];
      Object.values(response.data.data).forEach(invoiceArray => {
        if (Array.isArray(invoiceArray)) {
          allInvoices.push(...invoiceArray);
        }
      });

      console.log(`${allInvoices.length} factures à traiter:`, allInvoices);
      
      if (allInvoices.length > 0) {
        // Ajouter les données à Excel
        appendApiDataToExcel(allInvoices);
        
        // Simulation de l'API
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        setIsProcessing(false);
        setIsComplete(true);
        
        toast({
          title: "Traitement terminé",
          description: `Vos ${allInvoices.length} factures ont été traitées avec succès!`,
        }); 
        alert(`✅ ${allInvoices.length} factures traitées avec succès !`);
      } else {
        setIsProcessing(false);
        alert("❌ Aucune facture valide trouvée dans les fichiers PDF");
      }
    } else {
      setIsProcessing(false);
      alert(`❌ Erreur : ${response.data.message}`);
    }
  } catch (error: any) {
    console.error("Erreur API :", error.response || error.message);
    alert("❌ Erreur lors de l'envoi des fichiers PDF");
    setIsProcessing(false);
  }
};
// const transfere_Aml = async () => {
//   if (files.length === 0) {
//     alert("Veuillez ajouter au moins un PDF !");
//     return;
//   }

//   const formData = new FormData();
//   files.forEach((file) => formData.append("files", file));

//   try {
//     setIsProcessing(true);

//     const response = await axios.post("http://127.0.0.1:8088/transfer_aml", formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });

//     console.log("Réponse API :", response.data);

//     if (response.data.status === "success") {
//       // Transformer l'objet en tableau
//       const dataArray = Object.values(response.data.data);

//       appendApiDataToExcel(dataArray);

//       // Simulation de traitement
//       await new Promise((resolve) => setTimeout(resolve, 3000));

//       setIsProcessing(false);
//       setIsComplete(true);

//       toast({
//         title: "Traitement terminé",
//         description: "Vos factures ont été traitées avec succès !",
//       });

//       alert(`✅ ${response.data.rows} factures traitées avec succès !`);
//     } else {
//       alert(`❌ Erreur : ${response.data.message}`);
//     }
//   } catch (error: any) {
//     console.error("Erreur API :", error.response || error.message);
//     alert("❌ Erreur lors de l'envoi des fichiers PDF");
//   } finally {
//     setIsProcessing(false);
//   }
// };
const transfere_Aml = async () => {
  if (files.length === 0) {
    alert("Veuillez ajouter au moins un PDF !");
    return;
  }

  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file); // clé "files" côté Flask
  });

  try {
    setIsProcessing(true);

    const response = await axios.post("http://127.0.0.1:8088/transfer_aml", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.data.status === "success") {
      // Transformer l'objet en tableau unique
      const dataArrays = Object.values(response.data.data); // tableau de tableaux
      const mergedData = dataArrays.flat(); // tableau unique de toutes les factures

      // ✅ Transformer Remorque en string (premier élément du tableau)
      const excelReadyData = mergedData.map(item => ({
        ...item,
        Remorque: Array.isArray(item.Remorque) && item.Remorque.length > 0 ? item.Remorque[0] : "",
      }));

      console.log("Factures AML prêtes pour Excel :", excelReadyData);

      appendApiDataToExcel(excelReadyData);

      // Simulation temps de traitement
      await new Promise((resolve) => setTimeout(resolve, 3000));

      setIsProcessing(false);
      setIsComplete(true);

      toast({
        title: "Traitement terminé",
        description: "Vos factures AML ont été traitées avec succès !",
      });
      alert(`✅ ${response.data.rows} factures traitées avec succès !`);
    } else {
      alert(`❌ Erreur : ${response.data.message}`);
    }
  } catch (error: any) {
    console.error("Erreur API :", error.response || error.message);
    alert("❌ Erreur lors de l'envoi des fichiers PDF");
  } finally {
    setIsProcessing(false);
  }
};




// const handleDownload = () => {
//   if (!excelData.length) {
//     alert("Aucune donnée à télécharger !");
//     return;
//   }

//   // ✅ Si tu veux garder les données existantes + celles de l'API
//   const ws = XLSX.utils.json_to_sheet(excelData);
//   const wb = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, "Factures");

//   const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//   const blob = new Blob([wbout], { type: "application/octet-stream" });
//   saveAs(blob, excelFile ? excelFile.name : "factures_mise_a_jour.xlsx");

//   toast({
//     title: "Téléchargement démarré",
//     description: "Le fichier Excel mis à jour a été téléchargé.",
//   });

//   resetModal();
// };
// const handleDownload = () => {
//   if (!excelData || excelData.length === 0) {
//     alert("Aucune donnée à télécharger !");
//     return;
//   }

//   // Création d'une nouvelle feuille Excel avec uniquement excelData
//   const ws = XLSX.utils.json_to_sheet(excelData);
//   const wb = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, "Factures");

//   // Conversion en binaire et téléchargement
//   const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//   const blob = new Blob([wbout], { type: "application/octet-stream" });
//   saveAs(blob, "factures.xlsx");

//   toast({
//     title: "Téléchargement réussi",
//     description: "Un nouveau fichier Excel a été généré.",
//   });
//   resetModal();
// };
const handleDownload = () => {
  // 🔹 Vérifier que des données existent
  if (!excelData || excelData.length === 0) {
    alert("Aucune donnée à télécharger !");
    return;
  }

  try {
    // 🔹 Déterminer les headers selon le type de facture
    let headers = [];
    
    if (invoiceType.title === 'DFDS') {
      headers = ["N_CL_Transp","N_DOC_Externe", "Remorque","Date","Total", "tracteur",  "Destination", ];
      
    } else if (invoiceType.title === 'Siège') {
      headers = ["N_CL_Transp","N_DOC_Externe", "Remorque", "Date", "total","Tracteur", "Destination",  "prestation"];
    } else {
      headers = ["N_CL_Transp", "N_DOC_Externe", "Remorque", "Date", "Total" ,"Destination"];
    }

    // 🔹 Créer la feuille Excel en forçant l'ordre des colonnes
    const ws = XLSX.utils.json_to_sheet(excelData, { header: headers });

    // 🔹 Ajuster la largeur des colonnes pour un meilleur affichage
    const colWidths = headers.map(header => ({ width: 15 }));
    ws['!cols'] = colWidths;

    // 🔹 Créer un nouveau classeur
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Factures");

    // 🔹 Convertir et télécharger le fichier
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    saveAs(blob, "factures.xlsx");

    // 🔹 Message de succès
    toast({
      title: "Téléchargement réussi ✅",
      description: "Un nouveau fichier Excel a été généré avec succès.",
    });

    // 🔹 Réinitialiser la modale si présente
    if (resetModal) resetModal();

  } catch (error) {
    console.error("Erreur lors du téléchargement :", error);
    toast({
      title: "Erreur ❌",
      description: "Une erreur est survenue lors de la génération du fichier Excel.",
    });
  }
};
  const resetModal = () => {
    setStep(1);
    setExcelFile(null);
    setPdfCount("");
    setPdfInputs([]);
    setIsProcessing(false);
    setIsComplete(false);
    onClose();
  };

  const getVariantColor = () => {
    switch (invoiceType.variant) {
      case "success": return "text-success";
      case "warning": return "text-warning";
      default: return "text-primary";
    }
  };

  const canProceed = () => {
    if (step === 1) return  pdfCount;
    if (step === 2) return pdfInputs.every(input => input.trim() !== "");
    return false;
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="max-w-2xl bg-gradient-card border-border/20">
        <DialogHeader>
          <DialogTitle className={`text-2xl font-bold ${getVariantColor()}`}>
            Traitement des factures {invoiceType.title}
          </DialogTitle>
        </DialogHeader>

        {!isComplete ? (
          <div className="space-y-6">
            {/* Progress indicator */}
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      stepNum <= step
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div
                      className={`w-16 h-0.5 mx-2 ${
                        stepNum < step ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {step === 1 && (
              <div className="space-y-6">
                {/* <Card className="p-6 bg-card/50 border-border/20">
                  <div className="space-y-4">
                    <Label htmlFor="excel-upload" className="text-base font-medium">
                      Fichier Excel de base
                    </Label>
                    <div className="border-2 border-dashed border-border/40 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                      <input
                        id="excel-upload"
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleExcelUpload}
                        className="hidden"
                      />
                      <label htmlFor="excel-upload" className="cursor-pointer">
                        <FileSpreadsheet className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        {excelFile ? (
                          <p className="text-sm font-medium text-foreground">{excelFile.name}</p>
                        ) : (
                          <>
                            <p className="text-sm font-medium">Cliquez pour sélectionner un fichier Excel</p>
                            <p className="text-xs text-muted-foreground">XLSX, XLS acceptés</p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </Card> */}

                <Card className="p-6 bg-card/50 border-border/20">
                  <div className="space-y-4">
                    <Label htmlFor="pdf-count" className="text-base font-medium">
                      Nombre de Fichier PDF
                    </Label>
                    <Select onValueChange={handlePdfCountChange} value={pdfCount}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez le nombre de PDFs" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 10, 15, 20].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} pdf{num > 1 ? 's' : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </Card>

                <Button
                  onClick={() => setStep(2)}
                  disabled={!canProceed()}
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all"
                >
                  Continuer
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">
                    Ajoutez vos {pdfCount} factures PDF
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Vous pouvez uploader des fichiers ou saisir des liens
                  </p>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {pdfInputs.map((input, index) => (
                    <Card key={index} className="p-4 bg-card/50 border-border/20">
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">
                          Facture {index + 1}
                        </Label>
                        <div className="flex gap-2">
                          <Input
                              placeholder=""
                              value={input || ""}
                              className="flex-1"
                              readOnly
                            />
                          <Button
                            variant="outline"
                            size="icon"
                            className="shrink-0"
                            onClick={() => {
                              const fileInput = document.createElement('input');
                              fileInput.type = 'file';
                              fileInput.accept = '.pdf';
                              fileInput.onchange = (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0];
                                if (file) {
                                  // 1️⃣ update pdfInputs pour afficher le nom
                                  handlePdfInputChange(index, file.name);

                                  // 2️⃣ ajouter le fichier réel à la list `files`
                                  setFiles((prev) => [...prev, file]);
                                }
                              };
                              fileInput.click();
                            }}
                          >
                            <Upload className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Retour
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    disabled={!canProceed()}
                    className="flex-1 bg-gradient-primary hover:shadow-glow transition-all"
                  >
                    Valider
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
                    <FileSpreadsheet className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">Prêt pour le traitement</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Fichier Excel: {excelFile?.name}</p>
                    <p>Nombre de PDF: {pdfCount}</p>
                    <p>Type: {invoiceType.title}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                    Retour
                  </Button>
                  <Button
                     onClick={async () => {
                      setIsProcessing(true);

                      // 2️⃣ Appeler l'API
                      if (invoiceType.title === "Siège") {
                        await transfere_agence();

                      } else if (invoiceType.title === "DFDS") {
                        await transfer_dfds();
                      } else {
                        await transfere_Aml();
                      }


                      
                      setIsProcessing(false);
                    }}
                    disabled={isProcessing}
                    className="flex-1 bg-gradient-primary hover:shadow-glow transition-all"
                  >
                    {isProcessing ? "Traitement en cours..." : "Traiter les factures"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 text-center py-8">
            <div className="w-20 h-20 mx-auto bg-gradient-success rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-success">Traitement terminé!</h3>
              <p className="text-muted-foreground">
                Vos factures ont été traitées et le fichier Excel a été mis à jour.
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleDownload} className="flex-1 bg-gradient-success">
                <Download className="w-4 h-4 mr-2" />
                Télécharger le fichier
              </Button>
              <Button variant="outline" onClick={resetModal} className="flex-1">
                Fermer
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
