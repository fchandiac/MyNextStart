"use client";
import React, { useEffect, useState } from "react";
import {
  Grid,
  Box,
  Typography,
  Button,
  CircularProgress,
  IconButton,
  Divider,
  Dialog,
  Stack,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArticleIcon from "@mui/icons-material/Article";
import PrintIcon from "@mui/icons-material/Print";
import { useAlertContext } from "@/context/AlertContext";
import { createReception } from "@/app/actions/reception";
import ReceptionGeneralData from "./ui/ReceptionGeneralData";
import GrainAnalysis from "./ui/GrainAnalysis";
import { useReceptionContext } from "@/context/ReceptionDataContext";
import { CreateReceptionPayload } from "@/types/reception";
import { useUserContext } from "@/context/UserContext";
import { getDefaultTemplate } from "@/app/actions/discount-template";
import { TemplateType } from "@/types/discount-template";
import SelectTemplate from "./ui/template/SelectTemplate";
import TemplateComponent from "./ui/template/Template";
import ErrorSummary from "./ui/ErrorSummary";
import PrintDialog from "@/components/PrintDialog/PrintDialog";

export default function NewReceptionPage() {
  const { showAlert } = useAlertContext();
  const { data, liveClusters, setTemplate } = useReceptionContext();
  const { user } = useUserContext();

  const [loadingTemplate, setLoadingTemplate] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);

  // dialog state
  const [openTemplateDialog, setOpenTemplateDialog] = useState(false);
  const [openSaveTemplateDialog, setOpenSaveTemplateDialog] = useState(false);
  const [openPrintDialog, setOpenPrintDialog] = useState(false);

  // Función para detectar si hay errores de validación
  const hasValidationErrors = (): boolean => {
    const checkNodeErrors = (cluster: any): boolean => {
      return !!(
        (cluster.percent?.error && cluster.percent?.errorMessage) ||
        (cluster.tolerance?.error && cluster.tolerance?.errorMessage) ||
        (cluster.penalty?.error && cluster.penalty?.errorMessage) ||
        (cluster.range?.error && cluster.range?.errorMessage) ||
        (cluster.node?.error && cluster.node?.errorMessage)
      );
    };

    return Object.values(liveClusters).some(cluster => 
      cluster && typeof cluster === 'object' && checkNodeErrors(cluster)
    );
  };

  useEffect(() => {
    const fetchTemplate = async () => {
      setLoadingTemplate(true);
      const template = await getDefaultTemplate();
      if (template) {
        setTemplate(template);
      } else {
        showAlert("No se encontró la plantilla por defecto", "error");
      }
      setLoadingTemplate(false);
    };
    fetchTemplate();
  }, [setTemplate]);

  const handleSave = async () => {
    console.log("data", data);
    // guardar recepción...
  };

  const handlePrint = () => {
    setOpenPrintDialog(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const { key, code } = e;
    if (key === "Enter") {
      e.preventDefault();
      const focusable = Array.from(
        document.querySelectorAll<HTMLElement>(
          "input:not([readonly]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])"
        )
      ).filter(
        (el) =>
          el.offsetParent !== null &&
          getComputedStyle(el).visibility !== "hidden" &&
          el.getAttribute("aria-hidden") !== "true" &&
          !el.hasAttribute("data-skip-focus")
      );
      const idx = focusable.indexOf(e.target as HTMLElement);
      const next = focusable[idx + 1];
      if (next) next.focus();
      return;
    }
    if (code === "NumpadAdd") {
      e.preventDefault();
      const target = e.target as HTMLElement;
      if (target.tagName === "BUTTON") {
        (target as HTMLButtonElement).click();
        return;
      }
      const form = target.closest("form");
      const defaultBtn =
        form?.querySelector('button[type="submit"]') ||
        document.querySelector("button[data-default-action]");
      if (defaultBtn instanceof HTMLButtonElement) defaultBtn.click();
    }
  };

  return (
    <>
      <Box sx={{ p: 2 }} onKeyDown={handleKeyDown}>
        <Grid container spacing={2} sx={{ minWidth: 0 }}>
          {/* General Data */}
          <Grid item xs={12} md={3}>
            <Typography gutterBottom>Datos de la recepción</Typography>
            <ReceptionGeneralData />

            <Divider
              sx={{
                my: 2,
                borderColor: "primary.main",
                borderBottomWidth: 2,
                opacity: 0.6,
              }}
            />
            
            {/* Error Summary - Solo visible cuando hay errores */}
            {hasValidationErrors() && (
              <>
                <Typography gutterBottom sx={{ textAlign: 'right' }}>Errores de validación</Typography>
                <ErrorSummary />
              </>
            )}
          </Grid>

          {/* Grain Analysis */}
          <Grid item xs={12} md={6.5}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography gutterBottom>Análisis de granos</Typography>
              <Typography gutterBottom>
                Plantilla: {data.template.name}
              </Typography>
            </Box>

            <GrainAnalysis
            // template={data.template}
            // loadingTemplate={loadingTemplate}
            />
          </Grid>

          {/* Summary & Actions */}
          <Grid item xs={12} md={2.5}>
            <Typography gutterBottom>Totales</Typography>

            {/* Box resumen con borde redondeado y valores */}
            <Box
              sx={{
                border: "1px solid #1976d2",
                borderRadius: 2,
                p: 2,
                mb: 2,
                background: "#f7fafd",
                overflow: "auto",
                minWidth: 0,
              }}
            >
              <Box component="dl" sx={{ m: 0 }}>
                <Box
                  component="div"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Box component="dt">Peso Bruto</Box>
                  <Box component="dd">
                    {isNaN(liveClusters.grossWeight.node.value) 
                      ? '0 kg' 
                      : `${liveClusters.grossWeight.node.value} kg`}
                  </Box>
                </Box>
                <Box
                  component="div"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Box component="dt">Tara</Box>
                  <Box component="dd">
                    {isNaN(liveClusters.tare.node.value) 
                      ? '0 kg' 
                      : `${liveClusters.tare.node.value} kg`}
                  </Box>
                </Box>
                <Box
                  component="div"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Box component="dt">Peso Neto</Box>
                  <Box component="dd">
                    {isNaN(liveClusters.netWeight.node.value) 
                      ? '0 kg' 
                      : `${liveClusters.netWeight.node.value} kg`}
                  </Box>
                </Box>
                <Box
                  component="div"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Box component="dt">Total Descuentos</Box>
                  <Box component="dd">
                    {isNaN(liveClusters.DiscountTotal.node.value) 
                      ? '0 kg' 
                      : `${liveClusters.DiscountTotal.node.value} kg`}
                  </Box>
                </Box>
                <Box
                  component="div"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Box component="dt">Bonificación</Box>
                  <Box component="dd">
                    {liveClusters.Bonus.penalty && !isNaN(liveClusters.Bonus.penalty.value)
                      ? `${liveClusters.Bonus.penalty.value} kg`
                      : "0 kg"}
                  </Box>
                </Box>
                <Box
                  component="div"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Box component="dt">Paddy Neto</Box>
                  <Box component="dd">
                    {isNaN(liveClusters.totalPaddy.node.value) 
                      ? '0 kg' 
                      : `${liveClusters.totalPaddy.node.value} kg`}
                  </Box>
                </Box>
              </Box>
            </Box>

            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <IconButton
                color="primary"
                sx={{
                  border: '1px solid',
                  borderColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    borderColor: 'primary.dark',
                  },
                }}
                onClick={handlePrint}
              >
                <PrintIcon />
              </IconButton>
              
              <Button
                fullWidth
                variant="contained"
                // onClick={handleSave}
                // disabled={loadingSave}
              >
                {loadingSave ? (
                  <CircularProgress size={24} />
                ) : (
                  "Guardar recepción"
                )}
              </Button>
            </Stack>

            <Divider 
              sx={{ 
                my: 2,
                borderColor: "primary.main",
                borderBottomWidth: 2,
                opacity: 0.6,
              }} 
            />
            <Typography gutterBottom sx={{ textAlign: 'right' }}>Plantillas</Typography>

            <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
              <IconButton
                color="primary"
                sx={{
                  border: '1px solid',
                  borderColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    borderColor: 'primary.dark',
                  },
                }}
                onClick={() => {
                  setOpenSaveTemplateDialog(true);
                }}
              >
                <SaveIcon />
              </IconButton>
              <Button
                variant="outlined"
                sx={{
                  border: '1px solid',
                  borderColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    borderColor: 'primary.dark',
                  },
                }}
                onClick={() => setOpenTemplateDialog(true)}
                startIcon={<ArticleIcon />}
              >
                Selección
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* Dialog para seleccionar plantilla */}
      <Dialog
        fullWidth
        maxWidth="lg"
        open={openTemplateDialog}
        onClose={() => setOpenTemplateDialog(false)}
      >
        <Box sx={{ p: 2 }}>
          <SelectTemplate closeDialog={() => setOpenTemplateDialog(false)} />
        </Box>
      </Dialog>

      {/* Dialog para guardar plantilla */}
      <Dialog
        fullWidth
        maxWidth="lg"
        open={openSaveTemplateDialog}
        onClose={() => setOpenSaveTemplateDialog(false)}
      >
        <Box sx={{ p: 2 }}>
          <TemplateComponent
            closeDialog={() => setOpenSaveTemplateDialog(false)}
          />
        </Box>
      </Dialog>

      {/* Dialog para imprimir */}
      <PrintDialog
        open={openPrintDialog}
        setOpen={setOpenPrintDialog}
        title="Recepción"
        dialogWidth="lg"
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h4" gutterBottom align="center">
            RECEPCIÓN DE PADDY
          </Typography>
          
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {/* Datos del Productor */}
            <Grid item xs={6}>
              <Typography variant="h6" gutterBottom>
                Datos del Productor
              </Typography>
              <Typography><strong>Nombre:</strong> {data.producerName || 'N/A'}</Typography>
              <Typography><strong>RUT:</strong> {data.producerRut || 'N/A'}</Typography>
              <Typography><strong>Razón Social:</strong> {data.producerBusinessName || 'N/A'}</Typography>
              <Typography><strong>Dirección:</strong> {data.producerAddress || 'N/A'}</Typography>
            </Grid>

            {/* Datos de la Recepción */}
            <Grid item xs={6}>
              <Typography variant="h6" gutterBottom>
                Datos de la Recepción
              </Typography>
              <Typography><strong>Fecha:</strong> {new Date().toLocaleDateString('es-CL')}</Typography>
              <Typography><strong>Guía:</strong> {data.guide || 'N/A'}</Typography>
              <Typography><strong>Placa Patente:</strong> {data.licensePlate || 'N/A'}</Typography>
            </Grid>

            {/* Totales */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Resumen de Pesos
              </Typography>
              <Box sx={{ 
                border: '1px solid #ccc', 
                borderRadius: 1, 
                p: 2,
                backgroundColor: '#f9f9f9'
              }}>
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <Typography><strong>Peso Bruto:</strong></Typography>
                    <Typography>
                      {isNaN(liveClusters.grossWeight.node.value) 
                        ? '0 kg' 
                        : `${liveClusters.grossWeight.node.value} kg`}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography><strong>Tara:</strong></Typography>
                    <Typography>
                      {isNaN(liveClusters.tare.node.value) 
                        ? '0 kg' 
                        : `${liveClusters.tare.node.value} kg`}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography><strong>Peso Neto:</strong></Typography>
                    <Typography>
                      {isNaN(liveClusters.netWeight.node.value) 
                        ? '0 kg' 
                        : `${liveClusters.netWeight.node.value} kg`}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography><strong>Paddy Neto:</strong></Typography>
                    <Typography>
                      {isNaN(liveClusters.totalPaddy.node.value) 
                        ? '0 kg' 
                        : `${liveClusters.totalPaddy.node.value} kg`}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </PrintDialog>
    </>
  );
}
