import React from 'react';

interface AdminPaginationProps {
    currentPage: number;
    totalPages: number;
    totalResults?: number;
    itemsPerPage?: number;
    onPageChange: (page: number) => void;
}

const AdminPagination: React.FC<AdminPaginationProps> = ({ 
    currentPage, 
    totalPages, 
    totalResults = 0, 
    itemsPerPage = 10,
    onPageChange 
}) => {
    // If there's only 1 page, we technically don't need pagination, but if the user wants it always visible or just when > 1:
    // Usually hide if 0 or 1.
    if (totalPages <= 1) return null;

    const start = ((currentPage - 1) * itemsPerPage) + 1;
    const end = Math.min(currentPage * itemsPerPage, totalResults || (currentPage * itemsPerPage));

    const getPageNumbers = () => {
        const pages = [];
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);

        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="flex flex-wrap justify-between items-center bg-white px-4 py-3 border-t border-[#e2d8d4] mt-4 rounded-b-lg">
            <div className="text-sm text-[#5c2e2e] mb-2 md:mb-0">
                {totalResults > 0 ? (
                    <>Showing <span className="font-medium">{start}</span> to <span className="font-medium">{end}</span> of <span className="font-medium">{totalResults}</span> results</>
                ) : (
                    <span>Page {currentPage} of {totalPages}</span>
                )}
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm font-medium rounded-md bg-white border border-[#e2d8d4] text-[#5c2e2e] hover:bg-[#f8f4f1] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                {getPageNumbers().map(pageNum => (
                    <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum)}
                        className={`px-3 py-1 text-sm font-medium rounded-md border ${
                            currentPage === pageNum
                                ? "bg-[#B35E3F] text-white border-[#B35E3F]"
                                : "bg-white border-[#e2d8d4] text-[#5c2e2e] hover:bg-[#f8f4f1]"
                        }`}
                    >
                        {pageNum}
                    </button>
                ))}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm font-medium rounded-md bg-white border border-[#e2d8d4] text-[#5c2e2e] hover:bg-[#f8f4f1] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default AdminPagination;
