export type LeaveRequestDocument = {
	id?: number | string;
	name?: string;
	file?: string;
	uploaded_at?: string;
};

export const userDocumentDeleteUrl = (id: string | number) => `/api/hr/user-documents/${id}/`;

export const normalizeLeaveDocuments = (raw: unknown): LeaveRequestDocument[] => {
	if (Array.isArray(raw)) {
		return raw.filter((item) => item != null) as LeaveRequestDocument[];
	}
	if (raw && typeof raw === 'object') {
		return [raw as LeaveRequestDocument];
	}
	if (typeof raw === 'string' && raw.trim()) {
		return [{ file: raw.trim() }];
	}
	return [];
};

export const resolveLeaveDocumentsFromRow = (row: any): LeaveRequestDocument[] =>
	normalizeLeaveDocuments(
		row?.documents ??
			row?.attachments ??
			row?.documents_data ??
			(row?.document != null ? row.document : null),
	);

export const hasLeaveDocuments = (row: any): boolean =>
	resolveLeaveDocumentsFromRow(row).length > 0;

export const leaveRequestDocumentLabel = (doc: LeaveRequestDocument): string => {
	if (doc.name?.trim()) return doc.name.trim();
	if (typeof doc.file === 'string' && doc.file) {
		try {
			return (
				decodeURIComponent(new URL(doc.file).pathname.split('/').pop() || '') ||
				`Document ${doc.id ?? ''}`
			);
		} catch {
			return doc.file.split('/').pop() || `Document ${doc.id ?? ''}`;
		}
	}
	return `Document ${doc.id ?? ''}`.trim();
};
