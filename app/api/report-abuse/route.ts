import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

interface AbuseReport {
  reportId: string;
  fileId: string;
  reason: string;
  reporterEmail?: string;
  comments: string;
  timestamp: string;
}

const reportsFilePath = join(process.cwd(), 'uploads', 'abuse_reports.json');
const uploadDir = join(process.cwd(), 'uploads'); // To ensure directory exists

async function readReports(): Promise<AbuseReport[]> {
  try {
    await mkdir(uploadDir, { recursive: true }); // Ensure uploads directory exists
    const data = await readFile(reportsFilePath, 'utf-8');
    return JSON.parse(data) as AbuseReport[];
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return []; // If file doesn't exist, return empty array
    }
    console.error('Error reading abuse reports:', error);
    throw new Error('Could not read abuse reports file.');
  }
}

async function writeReports(reports: AbuseReport[]): Promise<void> {
  try {
    await writeFile(reportsFilePath, JSON.stringify(reports, null, 2));
  } catch (error) {
    console.error('Error writing abuse reports:', error);
    throw new Error('Could not write abuse reports file.');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileId, reason, reporterEmail, comments } = body;

    if (!fileId || !reason || !comments) {
      return NextResponse.json({ error: 'Missing required fields: fileId, reason, and comments are required.' }, { status: 400 });
    }

    // Basic validation (can be expanded)
    if (typeof fileId !== 'string' || typeof reason !== 'string' || typeof comments !== 'string') {
        return NextResponse.json({ error: 'Invalid data types for fields.' }, { status: 400 });
    }
    if (reporterEmail && typeof reporterEmail !== 'string') {
        return NextResponse.json({ error: 'Invalid data type for email.' }, { status: 400 });
    }
    // A more robust fileId validation might check against existing metadata if needed, but not for now.


    const newReport: AbuseReport = {
      reportId: uuidv4(),
      fileId,
      reason,
      reporterEmail: reporterEmail || undefined,
      comments,
      timestamp: new Date().toISOString(),
    };

    const allReports = await readReports();
    allReports.push(newReport);
    await writeReports(allReports);

    console.log(`New abuse report submitted for fileId: ${fileId}, reason: ${reason}`);
    return NextResponse.json({ success: true, message: 'Abuse report submitted successfully.', reportId: newReport.reportId });

  } catch (error: any) {
    console.error('Error submitting abuse report:', error);
    if (error instanceof SyntaxError) { // JSON parsing error
        return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Failed to submit abuse report.' }, { status: 500 });
  }
}
