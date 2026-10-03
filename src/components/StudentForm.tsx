import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Student } from '../types/Student';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from 'react-redux';
import { addStudent, updateStudent } from '../store/studentSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

const courses = ['BCA', 'BBA', 'Arts', 'Engineering', 'Pharmacy'];
const genders = ['Male', 'Female', 'Other'] as const;
const currentYear = new Date().getFullYear();

const schema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  gender: z.enum(genders, { message: 'Gender is required' }),
  dob: z.string().min(1, 'Date of Birth is required').refine((value) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value && date <= new Date();
  }, 'Enter a valid date that is not in the future'),
  yearOfAdmission: z.number().int('Enter a whole year').min(2000, 'Year must be 2000 or later').max(currentYear, 'Year cannot be in the future'),
  course: z.string().min(1, 'Course is required'),
  address: z.object({
    street: z.string().trim().min(1, 'Street is required'),
    city: z.string().trim().min(1, 'City is required'),
    state: z.string().trim().min(1, 'State is required'),
    postalCode: z.string().trim().min(1, 'Postal Code is required'),
  }),
  phone: z.string().trim().refine((value) => {
    const digits = value.replace(/\D/g, '');
    return /^\+?[\d\s()-]+$/.test(value) && digits.length >= 10 && digits.length <= 15;
  }, 'Enter a valid phone number with 10 to 15 digits'),
  email: z.string().trim().email('Valid email is required'),
});

type FormData = z.infer<typeof schema>;

const StudentForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const students = useSelector((state: RootState) => state.students.students);
  const existingStudent = students.find((s) => s.id === id);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: existingStudent ? {
      ...existingStudent,
    } : {
      yearOfAdmission: currentYear,
    }
  });

  useEffect(() => {
    if (existingStudent) {
      reset(existingStudent);
    }
  }, [existingStudent, reset]);

  const onSubmit = (data: FormData) => {
    if (existingStudent) {
      dispatch(updateStudent({ ...data, id: existingStudent.id } as Student));
    } else {
      dispatch(addStudent({ ...data, id: uuidv4() } as Student));
    }
    navigate('/');
  };

  return (
    <div className="form-container">
      <h2>{existingStudent ? 'Edit Student' : 'Add New Student'}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="form-grid">
        <div className="form-group full-width">
          <label>Name</label>
          <input {...register('name')} placeholder="e.g. Himanshu" />
          {errors.name && <span className="error">{errors.name.message}</span>}
        </div>

        <div className="form-group">
          <label>Gender</label>
          <select {...register('gender')}>
            <option value="">Select Gender</option>
            {genders.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          {errors.gender && <span className="error">{errors.gender.message}</span>}
        </div>

        <div className="form-group">
          <label>Date of Birth</label>
          <input type="date" {...register('dob')} />
          {errors.dob && <span className="error">{errors.dob.message}</span>}
        </div>

        <div className="form-group">
          <label>Course</label>
          <select {...register('course')}>
            <option value="">Select Course</option>
            {courses.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.course && <span className="error">{errors.course.message}</span>}
        </div>

        <div className="form-group">
          <label>Year of Admission</label>
          <input type="number" {...register('yearOfAdmission', { valueAsNumber: true })} />
          {errors.yearOfAdmission && <span className="error">{errors.yearOfAdmission.message}</span>}
        </div>

        <fieldset className="form-grid">
          <legend>Address</legend>
          <div className="form-group full-width">
            <label>Street</label>
            <input {...register('address.street')} />
            {errors.address?.street && <span className="error">{errors.address.street.message}</span>}
          </div>
          <div className="form-group">
            <label>City</label>
            <input {...register('address.city')} />
            {errors.address?.city && <span className="error">{errors.address.city.message}</span>}
          </div>
          <div className="form-group">
            <label>State</label>
            <input {...register('address.state')} />
            {errors.address?.state && <span className="error">{errors.address.state.message}</span>}
          </div>
          <div className="form-group">
            <label>Postal Code</label>
            <input {...register('address.postalCode')} />
            {errors.address?.postalCode && <span className="error">{errors.address.postalCode.message}</span>}
          </div>
        </fieldset>

        <div className="form-group">
          <label>Email</label>
          <input type="email" {...register('email')} />
          {errors.email && <span className="error">{errors.email.message}</span>}
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input type="tel" {...register('phone')} />
          {errors.phone && <span className="error">{errors.phone.message}</span>}
        </div>

        <div className="form-actions">
          <button type="submit">{existingStudent ? 'Update' : 'Add'} Student</button>
          <button type="button" onClick={() => navigate('/')} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
