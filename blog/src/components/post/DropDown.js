import { ref} from 'vue';
import listIcon from '../../assets/tiptap/list.svg';
import listNumbersIcon from '../../assets/tiptap/list-numbers.svg';
import pilcrowIcon from '../../assets/tiptap/pilcrow.svg';
import h1Icon from '../../assets/tiptap/h-1.svg';
import h2Icon from '../../assets/tiptap/h-2.svg';
import h3Icon from '../../assets/tiptap/h-3.svg';
import h4Icon from '../../assets/tiptap/h-4.svg';
import h5Icon from '../../assets/tiptap/h-5.svg';
import h6Icon from '../../assets/tiptap/h-6.svg';
import boldIcon from '../../assets/tiptap/bold.svg';
import italicIcon from '../../assets/tiptap/italic.svg';
import underlineIcon from '../../assets/tiptap/underline.svg';
import strikethroughIcon from '../../assets/tiptap/strikethrough.svg';
import codeIcon from '../../assets/tiptap/code.svg';
import codeBlockIcon from '../../assets/tiptap/file-code.svg';
import highlightIcon from '../../assets/tiptap/highlight.svg';

// 响应式 dropdownItems
const dropdownItems = ref({
  lists: [
    {
      name: '无序列表',
      path: listIcon,
      click: (editor) => editor.chain().focus().toggleBulletList().run(),
      isActive: 'bulletList',
    },
    {
      name: '有序列表',
      path: listNumbersIcon,
      click: (editor) => editor.chain().focus().toggleOrderedList().run(),
      isActive: 'orderedList',
    },
  ],
  headings: [
    {
      name: '默认段落',
      path: pilcrowIcon,
      click: (editor) => editor.chain().focus().setParagraph().run(),
      isActive: 'paragraph',
    },
    {
      name: '一级标题',
      path: h1Icon,
      click: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: { heading: { level: 1 } },
    },
    {
      name: '二级标题',
      path: h2Icon,
      click: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: { heading: { level: 2 } },
    },
    {
      name: '三级标题',
      path: h3Icon,
      click: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: { heading: { level: 3 } },
    },
    {
      name: '四级标题',
      path: h4Icon,
      click: (editor) => editor.chain().focus().toggleHeading({ level: 4 }).run(),
      isActive: { heading: { level: 4 } },
    },
    {
      name: '五级标题',
      path: h5Icon,
      click: (editor) => editor.chain().focus().toggleHeading({ level: 5 }).run(),
      isActive: { heading: { level: 5 } },
    },
    {
      name: '六级标题',
      path: h6Icon,
      click: (editor) => editor.chain().focus().toggleHeading({ level: 6 }).run(),
      isActive: { heading: { level: 6 } },
    },
  ],
});

const toolbarItems = ref([
  {
    name: '加粗',
    path: boldIcon,
    click: (editor) => editor.chain().focus().toggleBold().run(),
    isActive: 'bold',
  },
  {
    name: '斜体',
    path: italicIcon,
    click: (editor) => editor.chain().focus().toggleItalic().run(),
    isActive: 'italic',
  },
  {
    name: '下划线',
    path: underlineIcon,
    click: (editor) => editor.chain().focus().toggleUnderline().run(),
    isActive: 'underline',
  },
  {
    name: '删除线',
    path: strikethroughIcon,
    click: (editor) => editor.chain().focus().toggleStrike().run(),
    isActive: 'strike',
  },
  {
    name: '行内代码',
    path: codeIcon,
    click: (editor) => editor.chain().focus().toggleCode().run(),
    isActive: 'code',
  },
  {
    name: '代码块',
    path: codeBlockIcon,
    click: (editor) => editor.chain().focus().toggleCodeBlock().run(),
    isActive: 'codeBlock',
  },
  {
    name: '突出显示',
    path: highlightIcon,
    click: (editor) => editor.chain().focus().toggleHighlight({ color: '#ffcc00' }).run(),
    isActive: 'highlight',
  },
]);
export { dropdownItems ,toolbarItems };