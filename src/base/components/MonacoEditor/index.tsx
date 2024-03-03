import { FC, useEffect, useRef, useState } from 'react'
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import { useMount } from '@/base/hooks/mount';
import lightPlus from '@/../public/code/light_plus.json';
import darkPlus from '@/../public/code/dark_plus.json';

// @ts-ignore
self.MonacoEnvironment = {
  // @ts-ignore
  getWorker(_, label) {
    if (label === 'json') { return new jsonWorker() }
    if (label === 'css' || label === 'scss' || label === 'less') { return new cssWorker() }
    if (label === 'html' || label === 'handlebars' || label === 'razor') { return new htmlWorker() }
    if (label === 'typescript' || label === 'javascript') { return new tsWorker() }
    return new editorWorker()
  }
}

monaco.editor.defineTheme("light-plus", lightPlus as monaco.editor.IStandaloneThemeData);
monaco.editor.defineTheme("dark-plus", darkPlus as monaco.editor.IStandaloneThemeData);

const viewStates = new Map();

export interface IMonacoEditorProps {
  model?: monaco.editor.ITextModel;
  options?: monaco.editor.IEditorOptions;
  className?: string;
}

const MonacoEditor: FC<IMonacoEditorProps> = (props) => {
  
  const { model, options, className } = props;
  
  const [editorInstance, setEditorInstance] = useState<monaco.editor.IStandaloneCodeEditor>();

  useEffect(() => {
    if (editorInstance) {
      if (model) {
        const currentModel = editorInstance.getModel();
        if (model !== currentModel) {
          viewStates.set(currentModel, editorInstance.saveViewState());
          editorInstance.setModel(model);
          editorInstance.restoreViewState(viewStates.get(model));
        }
      } else {
        editorInstance.setModel(null);
      }
    }
  }, [model, editorInstance]);

  useEffect(() => {
    if (editorInstance && options) {
      editorInstance.updateOptions(options);
    }
  }, [options, editorInstance]);

  const containerRef = useRef<HTMLDivElement>(null);

  const createEditor = () => {
    if (!containerRef.current || editorInstance) return;

    const editor = monaco.editor.create(
      containerRef.current,
      {
        model,
        automaticLayout: true,
        ...options,
      },
    );

    setEditorInstance(editor);
    editor.restoreViewState(viewStates.get(model));
  };

  const disposeEditor = () => {
    if (!editorInstance) return;
    if (model) {
      viewStates.set(model, editorInstance.saveViewState());
    }
    editorInstance.dispose();
  }

  useMount(() => {
    createEditor();
    return () => (editorInstance && disposeEditor());
  });

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        position: 'relative',
        textAlign: 'initial',
      }}
    >
      <div style={{ width: '100%' }} ref={containerRef} />
    </div>
  );
}

export default MonacoEditor;
