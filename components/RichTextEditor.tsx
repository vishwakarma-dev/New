import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';
import 'prismjs/themes/prism.css';
import { Box, Divider, IconButton, MenuItem, Select, Tooltip } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import CodeIcon from '@mui/icons-material/Code';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import FormatClearIcon from '@mui/icons-material/FormatClear';
import './RichTextEditor.css';

export type RichTextToolbarConfig = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  headings?: boolean;
  lists?: boolean;
  quote?: boolean;
  code?: boolean;
  align?: Array<'left' | 'center' | 'right' | 'justify'>;
  link?: boolean;
  undo?: boolean;
  redo?: boolean;
  clear?: boolean;
};

export type RichTextEditorProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  toolbar?: RichTextToolbarConfig;
  pasteAsPlainText?: boolean;
  className?: string;
  toolbarClassName?: string;
  editorClassName?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  ariaLabel?: string;
};

const defaultToolbar: Required<RichTextToolbarConfig> = {
  bold: true,
  italic: true,
  underline: true,
  strike: true,
  headings: true,
  lists: true,
  quote: true,
  code: true,
  align: ['left', 'center', 'right', 'justify'],
  link: true,
  undo: true,
  redo: true,
  clear: true,
};

function isHTMLBlank(html: string) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html || '';
  return tmp.innerText.trim() === '' && !tmp.querySelector('img, video, iframe, br, hr');
}

export default function RichTextEditor({
  value,
  defaultValue,
  onChange,
  placeholder,
  disabled,
  toolbar: toolbarConfig,
  pasteAsPlainText,
  className,
  toolbarClassName,
  editorClassName,
  onFocus,
  onBlur,
  ariaLabel,
}: RichTextEditorProps) {
  const toolbar = useMemo(() => ({ ...defaultToolbar, ...(toolbarConfig || {}) }), [toolbarConfig]);
  const isControlled = typeof value === 'string';
  const [internalHTML, setInternalHTML] = useState<string>(defaultValue || '');
  const [selectionState, setSelectionState] = useState({
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    align: 'left' as 'left' | 'center' | 'right' | 'justify',
    link: false,
  });

  const editorRef = useRef<HTMLDivElement | null>(null);
  const lastNotifiedHTML = useRef<string>('');

  const getHTML = useCallback(() => {
    const html = editorRef.current?.innerHTML || '';
    return html;
  }, []);

  const setHTML = useCallback((html: string) => {
    if (editorRef.current && editorRef.current.innerHTML !== html) {
      editorRef.current.innerHTML = html || '';
    }
  }, []);

  const emitChange = useCallback(() => {
    const html = getHTML();
    if (onChange && html !== lastNotifiedHTML.current) {
      lastNotifiedHTML.current = html;
      onChange(html);
    }
  }, [getHTML, onChange]);

  useEffect(() => {
    if (isControlled) {
      const newHTML = value || '';
      if (editorRef.current && editorRef.current.innerHTML !== newHTML) {
        setHTML(newHTML);
      }
    }
  }, [isControlled, setHTML, value]);

  useEffect(() => {
    if (!isControlled) {
      setHTML(internalHTML);
    }
  }, [isControlled, internalHTML, setHTML]);

  const apply = useCallback((command: string, valueArg?: string) => {
    if (disabled) return;
    editorRef.current?.focus();
    document.execCommand(command, false, valueArg);
    emitChange();
    updateSelectionState();
  }, [disabled, emitChange]);

  const updateSelectionState = useCallback(() => {
    try {
      const bold = document.queryCommandState('bold');
      const italic = document.queryCommandState('italic');
      const underline = document.queryCommandState('underline');
      const strike = document.queryCommandState('strikeThrough');
      let align: 'left' | 'center' | 'right' | 'justify' = 'left';
      if (document.queryCommandState('justifyCenter')) align = 'center';
      else if (document.queryCommandState('justifyRight')) align = 'right';
      else if (document.queryCommandState('justifyFull')) align = 'justify';
      const link = document.queryCommandState('createLink');
      setSelectionState({ bold, italic, underline, strike, align, link });
    } catch (_) {
      // queryCommandState can throw in some contexts, ignore
    }
  }, []);

  useEffect(() => {
    const handler = () => updateSelectionState();
    document.addEventListener('selectionchange', handler);
    return () => document.removeEventListener('selectionchange', handler);
  }, [updateSelectionState]);

  const handleInput = useCallback(() => {
    const html = getHTML();
    if (!isControlled) setInternalHTML(html);
    emitChange();
  }, [emitChange, getHTML, isControlled]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!e.ctrlKey && !e.metaKey) return;
    const k = e.key.toLowerCase();
    if (k === 'b') { e.preventDefault(); apply('bold'); }
    if (k === 'i') { e.preventDefault(); apply('italic'); }
    if (k === 'u') { e.preventDefault(); apply('underline'); }
    if (k === 'z') { e.preventDefault(); apply('undo'); }
    if (k === 'y') { e.preventDefault(); apply('redo'); }
  }, [apply]);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
    if (!pasteAsPlainText) return;
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  }, [pasteAsPlainText]);

  const isEmpty = useMemo(() => isHTMLBlank(getHTML()), [internalHTML, value]);

  const makeLink = useCallback(() => {
    const url = window.prompt('Enter URL');
    if (!url) return;
    apply('createLink', url);
  }, [apply]);

  const removeLink = useCallback(() => {
    apply('unlink');
  }, [apply]);

  const setHeading = useCallback((level: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') => {
    if (level === 'p') apply('formatBlock', 'p');
    else apply('formatBlock', level);
  }, [apply]);

  useEffect(() => {
    // Initialize with provided controlled/uncontrolled value
    const initial = (isControlled ? (value || '') : internalHTML) || '';
    setHTML(initial);
  }, []); // eslint-disable-line

  return (
    <Box className={`rte-root ${className || ''}`.trim()}>
      <Box className={`rte-toolbar ${toolbarClassName || ''}`.trim()}>
        {toolbar.undo && (
          <Tooltip title="Undo"><span><IconButton size="small" onClick={() => apply('undo')} disabled={disabled}><UndoIcon /></IconButton></span></Tooltip>
        )}
        {toolbar.redo && (
          <Tooltip title="Redo"><span><IconButton size="small" onClick={() => apply('redo')} disabled={disabled}><RedoIcon /></IconButton></span></Tooltip>
        )}
        <Divider orientation="vertical" flexItem className="rte-divider" />
        {toolbar.bold && (
          <Tooltip title="Bold"><span><IconButton size="small" className={selectionState.bold ? 'rte-active' : ''} onClick={() => apply('bold')} disabled={disabled}><FormatBoldIcon /></IconButton></span></Tooltip>
        )}
        {toolbar.italic && (
          <Tooltip title="Italic"><span><IconButton size="small" className={selectionState.italic ? 'rte-active' : ''} onClick={() => apply('italic')} disabled={disabled}><FormatItalicIcon /></IconButton></span></Tooltip>
        )}
        {toolbar.underline && (
          <Tooltip title="Underline"><span><IconButton size="small" className={selectionState.underline ? 'rte-active' : ''} onClick={() => apply('underline')} disabled={disabled}><FormatUnderlinedIcon /></IconButton></span></Tooltip>
        )}
        {toolbar.strike && (
          <Tooltip title="Strikethrough"><span><IconButton size="small" className={selectionState.strike ? 'rte-active' : ''} onClick={() => apply('strikeThrough')} disabled={disabled}><StrikethroughSIcon /></IconButton></span></Tooltip>
        )}
        <Divider orientation="vertical" flexItem className="rte-divider" />
        {toolbar.headings && (
          <Select size="small" value={''} displayEmpty renderValue={() => 'Normal'} className="rte-heading-select" disabled={disabled}
            onChange={(e) => setHeading((e.target.value as any))}>
            <MenuItem value={'p'}>Normal</MenuItem>
            <MenuItem value={'h1'}>H1</MenuItem>
            <MenuItem value={'h2'}>H2</MenuItem>
            <MenuItem value={'h3'}>H3</MenuItem>
            <MenuItem value={'h4'}>H4</MenuItem>
            <MenuItem value={'h5'}>H5</MenuItem>
            <MenuItem value={'h6'}>H6</MenuItem>
          </Select>
        )}
        {toolbar.lists && (
          <>
            <Tooltip title="Bulleted list"><span><IconButton size="small" onClick={() => apply('insertUnorderedList')} disabled={disabled}><FormatListBulletedIcon /></IconButton></span></Tooltip>
            <Tooltip title="Numbered list"><span><IconButton size="small" onClick={() => apply('insertOrderedList')} disabled={disabled}><FormatListNumberedIcon /></IconButton></span></Tooltip>
          </>
        )}
        {toolbar.align && toolbar.align.length > 0 && (
          <>
            {toolbar.align.includes('left') && (
              <Tooltip title="Align left"><span><IconButton size="small" className={selectionState.align === 'left' ? 'rte-active' : ''} onClick={() => apply('justifyLeft')} disabled={disabled}><FormatAlignLeftIcon /></IconButton></span></Tooltip>
            )}
            {toolbar.align.includes('center') && (
              <Tooltip title="Align center"><span><IconButton size="small" className={selectionState.align === 'center' ? 'rte-active' : ''} onClick={() => apply('justifyCenter')} disabled={disabled}><FormatAlignCenterIcon /></IconButton></span></Tooltip>
            )}
            {toolbar.align.includes('right') && (
              <Tooltip title="Align right"><span><IconButton size="small" className={selectionState.align === 'right' ? 'rte-active' : ''} onClick={() => apply('justifyRight')} disabled={disabled}><FormatAlignRightIcon /></IconButton></span></Tooltip>
            )}
            {toolbar.align.includes('justify') && (
              <Tooltip title="Justify"><span><IconButton size="small" className={selectionState.align === 'justify' ? 'rte-active' : ''} onClick={() => apply('justifyFull')} disabled={disabled}><FormatAlignJustifyIcon /></IconButton></span></Tooltip>
            )}
          </>
        )}
        {toolbar.quote && (
          <Tooltip title="Blockquote"><span><IconButton size="small" onClick={() => apply('formatBlock', 'blockquote')} disabled={disabled}><FormatQuoteIcon /></IconButton></span></Tooltip>
        )}
        {toolbar.code && (
          <Tooltip title="Code"><span><IconButton size="small" onClick={() => apply('formatBlock', 'pre')} disabled={disabled}><CodeIcon /></IconButton></span></Tooltip>
        )}
        {toolbar.link && (
          <>
            <Tooltip title="Add link"><span><IconButton size="small" onClick={makeLink} disabled={disabled}><LinkIcon /></IconButton></span></Tooltip>
            <Tooltip title="Remove link"><span><IconButton size="small" onClick={removeLink} disabled={disabled}><LinkOffIcon /></IconButton></span></Tooltip>
          </>
        )}
        {toolbar.clear && (
          <>
            <Divider orientation="vertical" flexItem className="rte-divider" />
            <Tooltip title="Clear formatting"><span><IconButton size="small" onClick={() => apply('removeFormat')} disabled={disabled}><FormatClearIcon /></IconButton></span></Tooltip>
          </>
        )}
      </Box>

      <Box className={`rte-editor ${editorClassName || ''} ${disabled ? 'rte-disabled' : ''}`.trim()}>
        <div
          ref={editorRef}
          className={`rte-editable ${isEmpty ? 'rte-empty' : ''}`.trim()}
          contentEditable={!disabled}
          role="textbox"
          aria-label={ariaLabel || 'Rich text editor'}
          spellCheck
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onFocus={onFocus}
          onBlur={() => { onBlur && onBlur(); updateSelectionState(); }}
          data-placeholder={placeholder || ''}
        />
      </Box>
    </Box>
  );
}
