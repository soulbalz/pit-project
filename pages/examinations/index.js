import Layout from 'src/components/layouts';
import DataTable from 'src/components/datatables';
import { useSession } from 'next-auth/client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { API_URL } from 'src/constants';

dayjs.extend(isBetween);

export default function PageExaminationList() {
  const columns = [{
    name: 'การสอบ',
    selector: row => row.exam.name,
    sortable: true
  }, {
    name: 'วิชา',
    selector: row => row.exam.subject,
    sortable: true
  }, {
    name: 'วันที่เริ่มสอบ',
    selector: row => row.exam.exam_start,
    format: row => dayjs(row.exam.exam_start).format('DD MMM YYYY HH:mm'),
    sortable: true
  }, {
    name: 'วันที่สิ้นสุดสอบ',
    selector: row => row.exam.exam_end,
    format: row => dayjs(row.exam.exam_end).format('DD MMM YYYY HH:mm'),
    sortable: true
  }, {
    name: 'เวลาในการสอบ',
    selector: row => row.exam.exam_time,
    sortable: true
  }, {
    name: 'ผลคะแนน',
    sortable: false,
    allowOverflow: true,
    ignoreRowClick: true,
    wrap: true,
    style: {
      flexWrap: 'wrap'
    },
    cell: row => {
      const elem = [];
      const totalQuestionChoice = row.exam.total_question_choice;
      const totalQuestionWriting = row.exam.total_question_writing;
      if (totalQuestionChoice > 0) {
        if (row.is_submited) {
          elem.push(<div className='col-12 m-0 p-0'>เลือกตอบ: {row.total_choice_pass} / {totalQuestionChoice}</div>);
        } else {
          elem.push(<div className='col-12 m-0 p-0'>เลือกตอบ: รอผลคะแนน</div>);
        }
      }

      if (totalQuestionWriting > 0) {
        if (row.is_submited) {
          elem.push(<div className='col-12 m-0 p-0'>ข้อเขียน: {row.total_writing_score}</div>);
        } else {
          elem.push(<div className='col-12 m-0 p-0'>ข้อเขียน: รอผลคะแนน</div>);
        }
      }
      return elem;
    }
  }, {
    name: 'Action',
    sortable: false,
    allowOverflow: true,
    ignoreRowClick: true,
    button: true,
    cell: row => {
      const now = dayjs();
      const examStart = dayjs(row.exam.exam_start);
      const examEnd = dayjs(row.exam.exam_end);
      if (row.is_submited) {
        return 'ส่งคำตอบเรียบร้อยแล้ว';
      } else if (now < examStart) {
        return 'ยังไม่เริ่มการสอบ';
      } else if (now > examEnd) {
        return 'หมดเวลาสอบ';
      }
      return (
        <a href={`/examinations/${row._id}`} className='btn btn-info btn-lg mr-2 text-nowrap'>
          ทำข้อสอบ
        </a>
      );
    }
  }];

  const [session] = useSession();

  const [data, setData] = useState([]);

  useEffect(() => {
    if (session) {
      axios.get(`${API_URL}/api/examinations`, {
        headers: {
          Authorization: `Bearer ${session.user.apiToken}`
        }
      }).then(({ data }) => {
        setData(data);
      });
    }
  }, [session]);

  return (
    <Layout>
      <h3>การสอบ</h3>
      <DataTable columns={columns} data={data} subHeader={false} />
    </Layout>
  );
}
