import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface NotaData {
  id: number;
  alunoId: number;
  materiaId: number;
  bimestre: number;
  n1: string | number;
  n2: string | number;
  n3: string | number;
  media: string | number;
}

export interface AlunoData {
  id: number;
  numero: number;
  nome: string;
  turmaId: number;
}

export interface MateriaData {
  id: number;
  nome: string;
}

export interface TurmaData {
  id: number;
  nome: string;
  anoEscolar: string;
  turma: string;
  periodo: string;
}

/**
 * Exportar boletim individual de aluno em PDF
 */
export async function exportarBoletimAluno(
  aluno: AlunoData,
  turma: TurmaData,
  materias: MateriaData[],
  notas: NotaData[]
) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 15;

  // Header com logo e título
  doc.setFillColor(25, 103, 210);
  doc.rect(0, 0, pageWidth, 35, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('BOLETIM ESCOLAR', pageWidth / 2, 15, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Gestão Escolar de Notas - Escola App Mobile', pageWidth / 2, 25, { align: 'center' });

  yPosition = 45;

  // Informações do aluno
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMAÇÕES DO ALUNO', 15, yPosition);

  yPosition += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const infoAluno = [
    { label: 'Nome:', valor: aluno.nome },
    { label: 'Número:', valor: aluno.numero.toString() },
    { label: 'Turma:', valor: turma.nome },
    { label: 'Período:', valor: turma.periodo },
  ];

  infoAluno.forEach((info) => {
    doc.setFont('helvetica', 'bold');
    doc.text(info.label, 15, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(info.valor, 50, yPosition);
    yPosition += 6;
  });

  yPosition += 5;

  // Tabela de notas
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('NOTAS POR BIMESTRE', 15, yPosition);

  yPosition += 8;

  // Cabeçalho da tabela
  const colWidth = (pageWidth - 30) / 5;
  doc.setFillColor(25, 103, 210);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);

  const headers = ['Matéria', 'N1', 'N2', 'N3', 'Média'];
  let xPos = 15;
  headers.forEach((header) => {
    doc.text(header, xPos + colWidth / 2, yPosition, { align: 'center' });
    xPos += colWidth;
  });

  yPosition += 7;

  // Linhas de dados
  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  materias.forEach((materia) => {
    const notasMateria = notas.filter((n) => n.materiaId === materia.id);

    if (notasMateria.length > 0) {
      const medias = notasMateria.map((n) => parseFloat(n.media.toString()));
      const mediaFinal = medias.length > 0 ? medias.reduce((a, b) => a + b, 0) / medias.length : 0;

      // Alternância de cores de fundo
      if (Math.floor(yPosition / 7) % 2 === 0) {
        doc.setFillColor(240, 240, 240);
        doc.rect(15, yPosition - 5, pageWidth - 30, 6, 'F');
      }

      xPos = 15;
      doc.text(materia.nome, xPos + colWidth / 2, yPosition, { align: 'center' });
      xPos += colWidth;

      // Notas por bimestre
      const n1 = notasMateria[0]?.n1 || '-';
      const n2 = notasMateria[0]?.n2 || '-';
      const n3 = notasMateria[0]?.n3 || '-';

      doc.text(n1.toString(), xPos + colWidth / 2, yPosition, { align: 'center' });
      xPos += colWidth;
      doc.text(n2.toString(), xPos + colWidth / 2, yPosition, { align: 'center' });
      xPos += colWidth;
      doc.text(n3.toString(), xPos + colWidth / 2, yPosition, { align: 'center' });
      xPos += colWidth;

      // Média com cor
      const corMedia = mediaFinal >= 6 ? [34, 197, 94] : [220, 38, 38];
      doc.setTextColor(corMedia[0], corMedia[1], corMedia[2]);
      doc.setFont('helvetica', 'bold');
      doc.text(mediaFinal.toFixed(2), xPos + colWidth / 2, yPosition, { align: 'center' });
      doc.setTextColor(50, 50, 50);
      doc.setFont('helvetica', 'normal');

      yPosition += 7;
    }
  });

  yPosition += 5;

  // Resumo final
  const todasAsNotas = notas.map((n) => parseFloat(n.media.toString()));
  const mediaGeral = todasAsNotas.length > 0 ? todasAsNotas.reduce((a, b) => a + b, 0) / todasAsNotas.length : 0;
  const statusFinal = mediaGeral >= 6 ? 'APROVADO' : 'REPROVADO';
  const corStatus = mediaGeral >= 6 ? [34, 197, 94] : [220, 38, 38];

  doc.setFillColor(corStatus[0], corStatus[1], corStatus[2]);
  doc.rect(15, yPosition, pageWidth - 30, 15, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`MÉDIA GERAL: ${mediaGeral.toFixed(2)} - ${statusFinal}`, pageWidth / 2, yPosition + 10, {
    align: 'center',
  });

  // Rodapé
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`,
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );

  // Salvar PDF
  const nomeArquivo = `Boletim_${aluno.nome.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`;
  doc.save(nomeArquivo);
}

/**
 * Exportar relatório de turma em PDF
 */
export async function exportarRelatoriTurma(
  turma: TurmaData,
  alunos: AlunoData[],
  notasMap: Record<number, NotaData[]>
) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 15;

  // Header
  doc.setFillColor(25, 103, 210);
  doc.rect(0, 0, pageWidth, 30, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('RELATÓRIO DE TURMA', pageWidth / 2, 12, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(turma.nome, pageWidth / 2, 22, { align: 'center' });

  yPosition = 40;

  // Informações da turma
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Turma: ${turma.turma} | Período: ${turma.periodo} | Ano: ${turma.anoEscolar}`, 15, yPosition);

  yPosition += 10;

  // Tabela de alunos
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');

  const colWidth = (pageWidth - 30) / 3;
  doc.setFillColor(25, 103, 210);
  doc.setTextColor(255, 255, 255);

  doc.text('Aluno', 15 + colWidth / 2, yPosition, { align: 'center' });
  doc.text('Média Geral', 15 + colWidth + colWidth / 2, yPosition, { align: 'center' });
  doc.text('Status', 15 + colWidth * 2 + colWidth / 2, yPosition, { align: 'center' });

  yPosition += 7;

  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'normal');

  alunos.forEach((aluno, index) => {
    const notas = notasMap[aluno.id] || [];
    const todasAsNotas = notas.map((n) => parseFloat(n.media.toString()));
    const mediaGeral = todasAsNotas.length > 0 ? todasAsNotas.reduce((a, b) => a + b, 0) / todasAsNotas.length : 0;
    const status = mediaGeral >= 6 ? 'Aprovado' : 'Reprovado';
    const corStatus = mediaGeral >= 6 ? [34, 197, 94] : [220, 38, 38];

    // Alternância de cores
    if (index % 2 === 0) {
      doc.setFillColor(240, 240, 240);
      doc.rect(15, yPosition - 5, pageWidth - 30, 6, 'F');
    }

    doc.text(aluno.nome, 15 + colWidth / 2, yPosition, { align: 'center' });
    doc.text(mediaGeral.toFixed(2), 15 + colWidth + colWidth / 2, yPosition, { align: 'center' });

    doc.setTextColor(corStatus[0], corStatus[1], corStatus[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(status, 15 + colWidth * 2 + colWidth / 2, yPosition, { align: 'center' });

    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'normal');

    yPosition += 7;

    // Quebra de página se necessário
    if (yPosition > pageHeight - 20) {
      doc.addPage();
      yPosition = 15;
    }
  });

  // Rodapé
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(8);
  doc.text(
    `Gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`,
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );

  // Salvar PDF
  const nomeArquivo = `Relatorio_${turma.nome.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`;
  doc.save(nomeArquivo);
}


/**
 * Exportar notas por bimestre em PDF (consolidado de todos os alunos)
 */
export async function exportarNotasPorBimestre(
  turma: TurmaData,
  bimestre: number,
  alunos: AlunoData[],
  materias: MateriaData[],
  notasMap: Record<number, NotaData[]>
) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 15;

  // Header
  doc.setFillColor(25, 103, 210);
  doc.rect(0, 0, pageWidth, 35, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('NOTAS POR BIMESTRE', pageWidth / 2, 12, { align: 'center' });

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`${bimestre}º Bimestre - ${turma.nome}`, pageWidth / 2, 22, { align: 'center' });

  yPosition = 42;

  // Informações da turma
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Turma: ${turma.turma} | Período: ${turma.periodo} | Ano: ${turma.anoEscolar}`, 15, yPosition);

  yPosition += 8;

  // Tabela de notas por matéria
  const colWidth = (pageWidth - 30) / (materias.length + 1);
  doc.setFillColor(25, 103, 210);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);

  // Cabeçalho: Aluno + Matérias
  let xPos = 15;
  doc.text('Aluno', xPos + colWidth / 2, yPosition, { align: 'center' });
  xPos += colWidth;

  materias.forEach((materia) => {
    doc.text(materia.nome, xPos + colWidth / 2, yPosition, { align: 'center' });
    xPos += colWidth;
  });

  yPosition += 6;

  // Dados dos alunos
  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  alunos.forEach((aluno, index) => {
    // Alternância de cores
    if (index % 2 === 0) {
      doc.setFillColor(240, 240, 240);
      doc.rect(15, yPosition - 4, pageWidth - 30, 5, 'F');
    }

    xPos = 15;
    doc.text(`${aluno.numero} - ${aluno.nome.substring(0, 15)}`, xPos + colWidth / 2, yPosition, { align: 'center' });
    xPos += colWidth;

    // Notas por matéria
    materias.forEach((materia) => {
      const notas = notasMap[aluno.id] || [];
      const nota = notas.find((n) => n.materiaId === materia.id && n.bimestre === bimestre);
      const media = nota ? parseFloat(nota.media.toString()) : 0;
      const corMedia = media >= 6 ? [34, 197, 94] : media > 0 ? [220, 38, 38] : [200, 200, 200];

      doc.setTextColor(corMedia[0], corMedia[1], corMedia[2]);
      doc.setFont('helvetica', 'bold');
      doc.text(media > 0 ? media.toFixed(1) : '-', xPos + colWidth / 2, yPosition, { align: 'center' });
      doc.setTextColor(50, 50, 50);
      doc.setFont('helvetica', 'normal');

      xPos += colWidth;
    });

    yPosition += 5;

    // Quebra de página se necessário
    if (yPosition > pageHeight - 20) {
      doc.addPage();
      yPosition = 15;
    }
  });

  yPosition += 5;

  // Resumo de Desempenho Consolidado
  yPosition += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(25, 103, 210);
  doc.text('RESUMO DE DESEMPENHO', 15, yPosition);

  yPosition += 7;

  // Calcular estatísticas
  const alunosComNotas = alunos.filter((aluno) => {
    const notas = notasMap[aluno.id] || [];
    return notas.length > 0;
  });

  const mediasAlunos = alunosComNotas.map((aluno) => {
    const notas = notasMap[aluno.id] || [];
    const medias = notas.map((n) => parseFloat(n.media.toString())).filter((m) => m > 0);
    return medias.length > 0 ? medias.reduce((a, b) => a + b, 0) / medias.length : 0;
  });

  const aprovados = mediasAlunos.filter((m) => m >= 6).length;
  const reprovados = mediasAlunos.filter((m) => m > 0 && m < 6).length;
  const mediaGeral = mediasAlunos.length > 0 ? mediasAlunos.reduce((a, b) => a + b, 0) / mediasAlunos.length : 0;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(50, 50, 50);

  doc.text(`Total de Alunos: ${alunos.length}`, 15, yPosition);
  yPosition += 5;

  doc.setTextColor(34, 197, 94);
  doc.setFont('helvetica', 'bold');
  doc.text(`Aprovados (≥6.0): ${aprovados}`, 15, yPosition);
  yPosition += 5;

  doc.setTextColor(220, 38, 38);
  doc.text(`Reprovados (<6.0): ${reprovados}`, 15, yPosition);
  yPosition += 5;

  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'normal');
  doc.text(`Sem Notas: ${alunos.length - alunosComNotas.length}`, 15, yPosition);
  yPosition += 5;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(25, 103, 210);
  doc.text(`Média Geral da Turma: ${mediaGeral.toFixed(2)}`, 15, yPosition);

  // Rodapé
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(8);
  doc.text(
    `Gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`,
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );

  // Salvar PDF
  const nomeArquivo = `Notas_${bimestre}Bimestre_${turma.nome.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`;
  doc.save(nomeArquivo);
}
