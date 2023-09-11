import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import './formatted-text.css';

export default function FormattedText(props: { text: string }) {
    return <ReactMarkdown className="note" remarkPlugins={[remarkGfm]} linkTarget='_blank'>{props.text}</ReactMarkdown>
}
