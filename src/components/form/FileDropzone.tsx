import { Icon } from '@iconify/react/dist/iconify.js';
import Image from 'next/image';
import numeral from 'numeral';
import React, { useCallback } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import { ToastContainer, toast } from 'react-toastify';

interface Props {
  showOnlyButton?: boolean;
  buttonLabel?: string;
  maxSize?: number;
  maxFiles?: number;
  accept?: string | string[];
  onFilesUploaded?: (urls: string[]) => void;
  onFilesSelected?: (files: File[]) => void;
  disabled?: boolean;
}

export const FileDropzone = ({
  maxSize,
  maxFiles,
  accept,
  onFilesUploaded,
  onFilesSelected,
  showOnlyButton = false,
  buttonLabel = 'Upload Image',
  disabled = false,
}: Props) => {
  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      // Do something with the files
      if (fileRejections.length > 0) {
        toast.error(
          <div className="space-y-2">
            <div className="text-sm text-black-light">
              The {fileRejections.length > 1 ? 'files are' : 'file is'} not valid
            </div>
            <ul className="space-y-1">
              {fileRejections.map(({ file, errors }, index) => (
                <li key={index} className="flex flex-col gap-1">
                  <div className="pl-2 text-sm text-orange-500">{file.name}</div>
                  <div className="flex flex-col gap-1 pl-4">
                    {errors.map((error, eIndex) => (
                      <div key={eIndex} className="text-xs text-gray-300">
                        {error.message}
                      </div>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>,
        );
        return;
      }

      // If onFilesSelected is provided, use it (for actual file handling)
      if (onFilesSelected) {
        onFilesSelected(acceptedFiles);
      } else if (onFilesUploaded) {
        // Fallback to the old behavior for backward compatibility
        onFilesUploaded(acceptedFiles.map((_file) => '/images/landing/agent-companion1.webp'));
      }
    },
    [onFilesSelected, onFilesUploaded],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    maxFiles,
    accept: accept
      ? Array.isArray(accept)
        ? accept.reduce((acc, type) => ({ ...acc, [type]: [] }), {})
        : { [accept]: [] }
      : undefined,
    disabled,
  });

  return (
    <div
      className={`w-full max-w-[240px] mx-auto space-y-4 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {!showOnlyButton && (
        <div className="w-full aspect-square bg-black-light border border-dashed border-gray-700 p-4 flex flex-col items-center text-gray-350 text-xs">
          <Image
            src="/images/chatandbuild/agent-avatar.webp"
            width={175}
            height={165}
            alt="agent photo"
          />
          <div className="mt-4 text-center">
            <p>Max file size: {numeral(maxSize).format('0b')}</p>
            {isDragActive ? (
              <p className="text-white">Drop the files here ...</p>
            ) : (
              <p>Recommended: square image.</p>
            )}
          </div>
        </div>
      )}
      <button
        type="button"
        className="flex items-center justify-center gap-2 w-full rounded-full bg-orange-500 font-medium font-grotesk px-3 py-2 mb-0"
      >
        <Icon icon="tabler:upload" className="w-4 h-4" />
        {buttonLabel}
      </button>
      <ToastContainer position="bottom-right" />
    </div>
  );
};
