import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import React from 'react';
import { Applicant } from 'src/core/api';
import { AlertModal } from 'src/Nowruz/modules/general/components/AlertModal';
import { FeaturedIcon } from 'src/Nowruz/modules/general/components/featuredIcon-new';
import { Overlay } from 'src/Nowruz/modules/general/components/slideoutMenu';
import { OrgOfferModal } from 'src/Nowruz/modules/Jobs/containers/OrgOfferModal';

import { ApplicantDetails } from './applicant';
import { useApplicantAction } from './useApplicantAction';

interface TableProps {
  applicants: Array<Applicant>;
}

export const Table: React.FC<TableProps> = ({ applicants }) => {
  const { open, setOpen, applicant, columns, extractCellId, openAlert, setOpenAlert, handleReject, offer, setOffer } =
    useApplicantAction(applicants);

  const table = useReactTable({
    data: applicants,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="border-Gray-light-mode-200 border-solid border-b rounded-lg">
      <div className="py-2.5 px-4 flex">
        {/* <div
          onClick={() => {
            console.log();
          }}
          className="py-2.5 px-4 border-Gray-light-mode-200 border-solid border-b rounded-lg"
        >
          Reject
        </div> */}
      </div>
      <table className="w-full">
        <thead className="border-Gray-light-mode-200 border-solid border-b border-t-0 border-l-0 border-r-0">
          {table.getHeaderGroups().map((headerGroup) => {
            return (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th id={header.id} key={header.id} className="px-6 py-3 bg-Gray-light-mode-50 align-middle">
                      {' '}
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr
                key={row.id}
                className="border-Gray-light-mode-200 border-solid border-b border-t-0 border-l-0 border-r-0"
              >
                {row.getVisibleCells().map((cell) => {
                  const styleClass = extractCellId(cell);
                  return (
                    <td className={`${styleClass} px-6 py-3 align-middle`} key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="py-2.5 px-4 flex justify-end gap-3">
        {/* <div
          onClick={() => {
            console.log();
          }}
          className="py-2.5 px-4 border-Gray-light-mode-200 border-solid border-b rounded-lg"
        >
          Previous
        </div>
        <div
          onClick={() => {
            console.log();
          }}
          className="py-2.5 px-4 border-Gray-light-mode-200 border-solid border-b rounded-lg"
        >
          Next
        </div> */}
      </div>
      <Overlay open={open} onClose={() => setOpen(false)}>
        <ApplicantDetails applicant={applicant} />
      </Overlay>
      <AlertModal
        open={openAlert}
        onClose={() => setOpenAlert(false)}
        onSubmit={handleReject}
        message="Are you sure you want to reject this application? This action cannot be undone."
        title="Reject application"
        customIcon={<FeaturedIcon iconName="alert-circle" size="md" theme="error" type="light-circle-outlined" />}
        closeButtn={true}
        closeButtonLabel="Cancel"
        submitButton={true}
        submitButtonTheme="error"
        submitButtonLabel="Reject"
      />
      <OrgOfferModal onClose={() => setOffer(false)} open={offer} applicant={applicant} />
    </div>
  );
};
