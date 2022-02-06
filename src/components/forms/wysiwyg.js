import { Controller } from 'react-hook-form';
import ReactQuill, { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize-module';

Quill.register('modules/imageResize', ImageResize);

const modules = {
  imageResize: {},
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }, { align: [] }],
    ['blockquote', 'code-block'],
    [{ script: 'sub' }, { script: 'super' }],
    [{ indent: '-1' }, { indent: '+1' }],
    ['link', 'image', 'video']
  ]
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video',
  'alt',
  'height',
  'width',
  'style'
];

export default function TextWYSIWYG({
  name,
  control,
  defaultValue = '',
  rules = {},
  isInvalid = false
}) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue}
      render={(field) => (
        <ReactQuill
          {...field}
          theme='snow'
          modules={modules}
          formats={formats}
        />
      )}
    />
  );
};
